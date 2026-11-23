# 🌐 PI Hub — The Ultimate Bulk Image & Document Processing Platform

> **Every tool you could ever need to edit, optimize, convert, organize, and secure images and PDFs in bulk.**  
> Completely free, zero cloud upload wait times, and guaranteed 100% client-side privacy.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 🎯 What is PI Hub?

**PI Hub** is an all-in-one media and document workstation uniting the full capabilities of **iLoveIMG** and **iLovePDF** into a single, cohesive, modern platform. 

Instead of routing confidential contracts, personal family photos, financial statements, and government IDs to third-party servers, **PI Hub processes documents and images directly inside the user's browser using HTML5 Canvas 2D and WebAssembly (`pdf-lib`)**. Files never leave your local machine unless you explicitly invoke our optional server-side FastAPI fallback.

---

## 💎 Unique Selling Propositions (USPs) — Point by Point

1. **🛡️ 100% Client-Side Privacy (Zero-Knowledge Architecture)**:
   - Your files are never uploaded to any remote server or cloud database. All operations run directly in browser RAM (`Blob` and `ArrayBuffer`), guaranteeing total confidentiality for passports, NDAs, and private media.
2. **⚡ Zero Upload Delay & Instant Processing**:
   - Because files do not travel across the internet to a server queue, processing starts immediately upon selection. Compressing 50 images or merging 10 PDFs takes seconds, not minutes.
3. **🔍 Interactive Before/After Split Comparison Slider**:
   - Unlike iLoveIMG or Smallpdf, PI Hub features a dual-layer draggable comparison slider. Users can drag a vertical divider across their image to inspect pixel sharpness, artifacting, and color retention before downloading.
4. **📑 Visual Interactive PDF Page Organizer**:
   - A visual page thumbnail workspace allowing users to rotate individual pages by 90°, delete specific pages, and reorder document sequence with one-click export.
5. **✍️ Built-in e-Signature Studio (Sign PDF)**:
   - Draw smooth vector signatures, generate calligraphic cursive names, or stamp e-signatures onto any page of any PDF document.
6. **👁️ Client-Side OCR & Text Scanner**:
   - Optical Character Recognition running in your browser to extract selectable text from receipts, invoices, and photos with 1-click export to `.txt` or `.md`.
7. **📦 Automated Batch ZIP Packaging**:
   - Upload 5, 20, or 50 files simultaneously. PI Hub optimizes them in parallel and bundles all results into a single `.zip` archive via `JSZip`.
8. **🔄 Universal Format Conversion Matrix**:
   - An interactive compatibility engine that detects valid conversion paths across 10+ formats (JPG, PNG, WebP, AVIF, GIF, SVG, HEIC, TIFF, RAW/DNG, PDF, DOCX).
9. **⛓️ Workflow Automation & Tool Chaining**:
   - Chain repetitive steps: *Resize to 1200px ➔ Compress (85%) ➔ Watermark Copyright ➔ Convert to WebP* in a single batch pass.
10. **📱 PWA Ready (Progressive Web App)**:
    - Installable as a native desktop app on Windows and macOS, or on mobile devices (iOS/Android), with full offline support.
11. **💻 Developer REST API & Integration Playground**:
    - Includes a dedicated Python FastAPI backend (`api/main.py`) and developer documentation at `/api-docs` with sandbox API keys (`pi_hub_live_sk_...`) and ready-to-use snippets in cURL, Python, and Node.js.

---

## 💡 What is the Developer REST API & How Does It Work?

Think of PI Hub like a restaurant:
* **The Website Frontend** is the **Dining Room**: a human opens the website in their browser, clicks buttons, drags and drops files, and downloads them manually.
* **The Developer REST API** is the **Automated Delivery Kitchen**: what if an e-commerce company, real estate firm, or mobile app has **10,000 photos every day** that must be resized, watermarked, or compressed automatically? An employee cannot click buttons 10,000 times! Instead, their software sends the files directly to PI Hub's API in the background with zero human effort.

### Core API Capabilities
* **REST Endpoints (`/api/v1/...`)**: Special URLs built for code to send files and receive converted results:
  * `POST /api/v1/images/compress`: Sends an image file + quality setting -> returns the compressed image in < 0.5s.
  * `POST /api/v1/images/resize`: Sends an image + width/height -> returns the resized image.
  * `POST /api/v1/images/batch-zip`: Sends multiple files -> returns a single bundled `.zip` archive.
* **API Key (`pi_hub_live_sk_...`)**: Acts like a digital VIP pass so PI Hub knows which app is making the request and prevents spam abuse.
* **Code Snippets (cURL, Python, Node.js)**: Copy-and-paste code for programmers to integrate PI Hub into their own apps with zero guesswork.
* **Commercial SaaS Potential**: This is how companies like TinyPNG and CloudConvert generate B2B revenue (charging $29 to $99/mo for automated API access).

---

## 🧰 Complete Feature Catalog

### 🖼️ Image Studio Suite (`/image-tools`)
* **Compress IMAGE**: Intelligent lossy and lossless quantization for JPG, PNG, SVG, and WebP with quality slider (10% to 95%).
* **Resize IMAGE**: Scale by exact pixel bounds or percentage ratios with aspect ratio lock.
* **Crop IMAGE**: Visual and preset aspect ratios: 1:1 (Square), 16:9 (Widescreen), 4:3 (Standard), and 9:16 (Stories/Reels).
* **Convert to JPG**: Turn PNG, WebP, GIF, SVG, TIFF, BMP, and RAW files into standard JPEG with transparency background fill.
* **Convert from JPG**: Turn JPG images into lossless PNG or compact WebP.
* **Photo Editor**: Adjust brightness, contrast, saturation, B&W grayscale, and vintage sepia filters with real-time canvas rendering.
* **Watermark IMAGE**: Add text stamps or branding logos with custom font scaling, opacity, corner anchoring, or repeating diagonal tile patterns.
* **Meme Generator**: Create memes with classic Impact typography, stroke outlines, and dual top/bottom captioning.
* **Rotate IMAGE**: Batch rotate 90° clockwise, 180° flip, 270° counter-clockwise, or mirror horizontally/vertically.
* **Blur Face / Privacy**: Censor faces, license plates, and sensitive documents with Gaussian blur, pixelation mosaics, or blackout censor bars.

### 📄 PDF Studio Suite (`/pdf-tools`)
* **Merge PDF**: Combine multiple PDF files into one clean document in your chosen order.
* **Split PDF**: Extract page subsets using comma/dash notation (e.g. `1-3, 5, 8-10`) or burst all pages into individual files.
* **Compress PDF**: Structural stream optimization and Flate compression to dramatically reduce PDF file size.
* **Rotate PDF**: Batch orientation correction for upside-down or sideways pages (90°, 180°, 270°).
* **Organize PDF**: Interactive page grid to reorder, delete, and rotate pages before export.
* **Sign PDF**: Draw signatures with customizable ink colors or generate elegant calligraphic signatures to stamp onto any page.
* **OCR PDF & Text Scanner**: Extract copyable text and markdown from scanned receipts, contracts, and screenshots.
* **JPG to PDF**: Pack multiple images into an organized PDF with portrait, landscape, or auto orientation and custom margins.
* **PDF to JPG**: High-resolution rasterization of PDF pages into image formats for web embedding and presentations.
* **Watermark PDF**: Stamp legal labels (e.g. `CONFIDENTIAL`, `DRAFT`, `APPROVED`) diagonally across all document pages.
* **Protect PDF**: Add password security to prevent unauthorized document opening.
* **PDF to Markdown**: Extract structured text for LLMs, notes, and documentation.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** 18+ (tested on Node.js 24)
* **npm** or **pnpm**
* *(Optional)* Python 3.11+ for the FastAPI backend microservice

### 1. Launch the Next.js Frontend

```bash
# Navigate to project directory
cd "D:\PI Hub"

# Install dependencies
npm install --legacy-peer-deps

# Start the local development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Launch the Optional FastAPI Microservice

```bash
cd "D:\PI Hub\api"

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --reload --port 8000
```

Interactive API documentation will be available at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

---

## 🔒 Security & Data Privacy

1. **Client-Side Execution**: File bytes are loaded into browser memory (`ArrayBuffer` and `Blob`) and processed directly using Canvas 2D and `pdf-lib`. Sensitive personal photographs, government IDs, and legal documents never leave the user's computer.
2. **Ephemeral Memory Management**: Previews and generated output blobs use `URL.revokeObjectURL()` immediately when cleared to prevent memory leaks during large batch runs.
3. **Strict Validation**: All uploads are validated against explicit MIME types and extension whitelists before entering any processing pipeline.

---

## 📄 License
This project is open-source under the MIT License.
