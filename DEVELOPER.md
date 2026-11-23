# 🛠️ PI Hub — Technical Architecture & Developer Guide

This document provides a comprehensive technical guide for software engineers, contributors, and maintainers building upon the **PI Hub** codebase.

---

## 🏛️ 1. Architecture Overview

**PI Hub** is built upon a **Client-First Processing Pattern**:

```
[Browser Client]
      │
      ├── File Drag & Drop (UniversalDropzone)
      │         │
      │         ▼
      ├── Dynamic Options Schema (ToolWorkspace + Tool Registry)
      │         │
      │         ▼
      ├── In-Browser Execution Engine
      │    ├── Image Processing: HTML5 Canvas, OffscreenCanvas (image-processor.ts)
      │    └── PDF Processing:   pdf-lib WASM engine (pdf-processor.ts)
      │         │
      │         ▼
      ├── In-Memory Blob Assembly & Reduction Metrics
      │         │
      │         ▼
      └── Batch Packaging: JSZip stream export -> Local File Download
```

For workloads requiring headless conversions (e.g. Word `.docx` to `.pdf`), the system falls back to the **FastAPI Microservice** located in `/api`.

---

## 📂 2. Repository Layout & File Responsibilities

| Path | Purpose |
| :--- | :--- |
| `src/app/page.tsx` | Main dashboard featuring real-time client-side search, category filter pills, studio toggles, and dynamic tool grid. |
| `src/app/tools/[slug]/page.tsx` | Next.js dynamic App Router page that loads any tool workspace by slug based on `generateStaticParams`. |
| `src/app/convert/page.tsx` | Universal conversion hub with interactive format compatibility matrix (JPG, PNG, WebP, AVIF, GIF, SVG, HEIC, TIFF, RAW, PDF, DOCX). |
| `src/app/workflows/page.tsx` | Automation workspace for tool chaining (e.g. Resize ➔ Compress ➔ Watermark ➔ Convert). |
| `src/app/api-docs/page.tsx` | Developer REST API documentation with sandbox key rotation (`pi_hub_live_sk_...`) and code snippets in cURL, Python, and JavaScript. |
| `src/app/manifest.ts` | Progressive Web App (PWA) configuration for standalone desktop/mobile installation. |
| `src/components/ToolWorkspace.tsx` | Core workbench component: manages the staged files array, dynamic options controls, live execution status, and ZIP packaging. |
| `src/components/UniversalDropzone.tsx` | Validates file size limits, accepted extensions, and MIME signatures before queuing files. |
| `src/components/BeforeAfterSlider.tsx` | Dual-layer draggable quality comparison slider for side-by-side inspection. |
| `src/components/PDFPageOrganizer.tsx` | Visual PDF page thumbnail reordering, individual page rotation (90° increments), and selective page deletion. |
| `src/components/PDFSigner.tsx` | Vector signature drawing pad, calligraphic font generator, and PDF page stamping engine. |
| `src/components/OCRScanner.tsx` | Optical character recognition text extraction engine with live editing and TXT/Markdown export. |
| `src/lib/registry.ts` | The canonical manifest of all tools, accepted MIME types, max file sizes, and dynamic option schemas. |
| `src/lib/image-processor.ts` | Algorithms for client-side Canvas operations: MozJPEG quality simulation, matrix transforms, filters, and watermark math. |
| `src/lib/pdf-processor.ts` | High-level wrappers around `pdf-lib` for merging, splitting, watermarking, page rotations, and image embedding. |
| `api/main.py` | FastAPI application providing REST endpoints for server-side processing fallback. |

---

## ⚙️ 3. How the Dynamic Tool Registry Works

Instead of creating 50+ custom pages with duplicate upload and download code, every tool is defined declaratively in `src/lib/registry.ts`:

```typescript
export interface ToolDefinition {
  id: string;                         // Unique internal identifier
  name: string;                       // Display name (e.g., "Compress IMAGE")
  slug: string;                       // URL route (/tools/[slug])
  studio: "image" | "pdf";            // Studio suite
  category: "optimize" | "edit" | "convert" | "create" | "security";
  shortDesc: string;                  // Card description
  longDesc: string;                   // Workspace description
  icon: string;                       // Lucide icon identifier
  badge?: "New" | "Popular" | "Pro";  // UI tag
  acceptedMimeTypes: string[];        // MIME validation whitelist
  acceptedExtensions: string[];       // Extension validation whitelist
  defaultOutputFormat: string;
  supportedOutputFormats: string[];
  maxFiles: number;                   // Maximum concurrent files
  maxFileSizeMB: number;              // Size limit per file
  optionsSchema: Record<string, ToolOptionField>; // Dynamic options definition
}
```

### Adding a New Tool in 3 Steps:

1. **Register the tool** in `src/lib/registry.ts`:
   ```typescript
   {
     id: "invert-image",
     name: "Invert Colors",
     slug: "invert-image",
     studio: "image",
     category: "edit",
     shortDesc: "Invert all color channels in photographs.",
     longDesc: "Turn positive images into negatives with one click.",
     icon: "Repeat",
     acceptedMimeTypes: ["image/jpeg", "image/png"],
     acceptedExtensions: [".jpg", ".png"],
     defaultOutputFormat: "preserve",
     supportedOutputFormats: ["preserve", "jpg", "png"],
     maxFiles: 20,
     maxFileSizeMB: 50,
     optionsSchema: {}
   }
   ```
2. **Implement the transform logic** in `src/lib/image-processor.ts`:
   ```typescript
   if (toolId === "invert-image") {
     ctx.filter = "invert(100%)";
     ctx.drawImage(img, 0, 0);
   }
   ```
3. The page at `/tools/invert-image` is generated automatically with full drag-and-drop, batch queuing, and ZIP download support!

---

## 💡 4. Developer REST API & Microservice (`api/main.py`)

### What It Does & Why It Exists:
The website frontend is designed for manual human usage. But when businesses or developers need to process **thousands of images or documents per day automatically** (e.g. an e-commerce website resizing product photos upon upload), they make programmatic HTTP calls to PI Hub's REST API.

### Endpoints:
* `POST /api/v1/images/compress`: Encodes and quantizes images using MozJPEG optimization.
* `POST /api/v1/images/resize`: Scales images with high-fidelity Lanczos resampling.
* `POST /api/v1/images/batch-zip`: Archives multiple converted files into a downloadable `.zip` package.

### Authentication & Keys:
Requests are authenticated via `Bearer <api_key>`. In `/api-docs`, developers can generate keys following the format:
`pi_hub_live_sk_<24_hex_digits>`

---

## 🎨 5. Processing Engine Algorithms

### A. Image Compression Algorithm
Located in `src/lib/image-processor.ts`:
- Loads the uploaded `File` as an `HTMLImageElement` using an ephemeral `URL.createObjectURL`.
- Draws pixels onto an internal `HTMLCanvasElement`.
- Calls `canvas.toBlob(callback, mimeType, qualityFactor)`.
- For JPEGs and WebP, the browser's native encoder quantizes DCT coefficients to meet the requested compression quality.
- Revokes the source URL immediately to prevent memory leaks.

### B. PDF Merging Algorithm
Located in `src/lib/pdf-processor.ts`:
```typescript
export async function mergePDFs(files: File[]) {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  const pdfBytes = await mergedPdf.save();
  return { blob: new Blob([pdfBytes], { type: "application/pdf" }), outputName: "merged_document.pdf" };
}
```

---

## 🐳 6. Production Docker Deployment

A multi-container setup is defined in `docker-compose.yml`:
- **Web**: Next.js Node container serving the frontend.
- **API**: FastAPI container executing Python media workers.
- **Redis**: In-memory broker for background tasks.
- **Postgres**: State database for user accounts and conversion jobs (`pihub:pihub_secure_pass@db:5432/pihub`).

### Running in Production:
```bash
docker compose up -d --build
```

---

## 🧪 7. Testing & Quality Assurance

To test the frontend build:
```bash
npm run build
```

Verify the following before submitting changes:
1. **Memory Revocation**: Verify that all `createObjectURL` calls have a corresponding `revokeObjectURL` call when removing files from the staging queue.
2. **Format Fidelity**: Verify that transparent PNGs do not develop black backgrounds when converted to formats supporting alpha transparency (e.g. WebP).
3. **Large Batch Handling**: Verify that batch runs of 20+ images trigger the ZIP packaging without blocking the browser UI thread.
