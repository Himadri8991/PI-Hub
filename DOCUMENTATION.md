# PI Hub — Enterprise Media & Document Processing Platform

A complete, production-grade, privacy-first bulk image and PDF manipulation suite combining the full capabilities of **iLoveIMG** and **iLovePDF**.

---

## 🌟 Key Highlights & Engineering Features

- **22+ Integrated Tools**: 10+ Image Studio tools, 10+ PDF Studio tools, e-Signature Pad, and OCR Text Scanner.
- **Universal Format Matrix**: Interactively discover and execute valid conversions between 10+ major formats (JPG, PNG, WebP, GIF, SVG, HEIC, TIFF, RAW/DNG, PDF, DOCX).
- **Interactive Before/After Slider**: Real-time quality comparison slider for inspecting compression and filter changes.
- **Visual PDF Organizer**: Reorder, rotate individual pages, and delete pages visually.
- **Batch Processing & ZIP Packaging**: Drag & drop dozens of files simultaneously, configure settings in the dynamic inspector, process in parallel, and download as an organized `.zip` file.
- **Client-Side WASM & Canvas Engine**: 90% of file manipulations execute client-side via HTML5 Canvas, OffscreenCanvas, and `pdf-lib`. **Zero server delay, zero cloud storage queues, and 100% user privacy.**
- **Developer REST API**: Ready-to-deploy Python FastAPI microservice with Pillow, pikepdf, and background tasks for enterprise server-side fallback.

---

## 📁 Project Structure

```text
D:\PI Hub/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with navbar & footer
│   │   ├── page.tsx               # Homepage with live search & category filters
│   │   ├── globals.css            # Modern Tailwind CSS theme
│   │   ├── image-tools/page.tsx   # Dedicated Image Studio
│   │   ├── pdf-tools/page.tsx     # Dedicated PDF Studio
│   │   ├── convert/page.tsx       # Universal Format Conversion Matrix
│   │   ├── workflows/page.tsx     # Automated Pipeline Chaining (e.g. Resize -> Compress -> Convert)
│   │   ├── api-docs/page.tsx      # Developer REST API playground & key rotation
│   │   ├── manifest.ts            # Progressive Web App (PWA) offline manifest
│   │   └── tools/[slug]/page.tsx  # Dynamic Tool Workspace runner
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation with studio links & mobile drawer
│   │   ├── Footer.tsx             # Links, credits & privacy pledge
│   │   ├── ToolCard.tsx           # Dynamic card with Lucide icons & badges
│   │   ├── UniversalDropzone.tsx  # Multi-file drag & drop validator
│   │   ├── ToolWorkspace.tsx      # Staging queue, options inspector, processing & ZIP export
│   │   ├── BeforeAfterSlider.tsx  # Dual-layer quality comparison slider
│   │   ├── PDFPageOrganizer.tsx   # Visual PDF page reorder/rotate/delete
│   │   ├── PDFSigner.tsx          # Draw/Type e-signature canvas pad
│   │   └── OCRScanner.tsx         # Document text extraction workspace
│   ├── lib/
│   │   ├── registry.ts            # Canonical tool catalog & format matrix
│   │   ├── utils.ts               # File size formatting, class merging
│   │   ├── image-processor.ts     # Canvas & client-side image transformation algorithms
│   │   └── pdf-processor.ts       # pdf-lib PDF manipulation algorithms
│   └── types/
│       └── index.ts               # TypeScript schemas
├── api/
│   ├── main.py                    # FastAPI server
│   ├── requirements.txt           # Python dependencies (Pillow, pikepdf, uvicorn)
│   └── Dockerfile
├── docker-compose.yml             # Full-stack production orchestration (Web + API + Redis + Postgres)
├── package.json
└── tsconfig.json
```

---

## 🚀 How to Run the Platform

### 1. Web Frontend (Next.js 15)

```bash
# Navigate to project root
cd "D:\PI Hub"

# Start the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Python FastAPI Backend (Optional Server-Side Engine)

```bash
cd "D:\PI Hub\api"

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --reload --port 8000
```
API Documentation and Swagger UI will be available at [http://localhost:8000/docs](http://localhost:8000/docs).
