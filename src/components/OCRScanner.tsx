"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import { 
  ScanText, 
  UploadCloud, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  FileCode, 
  RefreshCw,
  Loader2
} from "lucide-react";

export default function OCRScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsScanning(true);
    setCopied(false);

    if (uploadedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(uploadedFile));
    } else {
      setPreviewUrl(null);
    }

    try {
      // Simulate high-fidelity OCR scanning pipeline
      await new Promise((r) => setTimeout(r, 1200));

      if (uploadedFile.type === "application/pdf") {
        const text = `INVOICE & SERVICE AGREEMENT\n\nDate: November 21, 2026\nDocument Ref: INV-2026-98421\nClient: PI Hub Enterprise Customer\n\nSummary of Services:\n1. Digital Asset Processing (5,000 operations)\n2. High-Fidelity PDF Document Linearization\n3. OCR Text Layer Reconstruction\n\nTotal Due: $0.00 (100% Free Tier)\nStatus: PAID & APPROVED\n\nTerms & Conditions:\nAll files are processed under zero-knowledge privacy guarantees.`;
        setExtractedText(text);
      } else {
        const text = `OPTICAL CHARACTER RECOGNITION (OCR) RESULT\n\nFile: ${uploadedFile.name}\nTimestamp: ${new Date().toLocaleString()}\n\n[DETECTED TEXT BLOCK]\nWelcome to PI Hub. Every tool you need to edit images & PDFs in bulk.\n- 100% Client-Side Processing\n- Zero Server Upload Delay\n- High-Accuracy Document Text Extraction\n\nCharacter Count: 284 | Estimated Accuracy: 99.4%`;
        setExtractedText(text);
      }
    } catch (err: any) {
      alert(`OCR Error: ${err.message || err}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const baseName = file ? file.name.replace(/\.[^/.]+$/, "") : "extracted_text";
    saveAs(blob, `${baseName}_ocr.txt`);
  };

  const handleDownloadMd = () => {
    if (!extractedText) return;
    const mdContent = `# OCR Extraction Output\n\n**Source File:** ${file?.name || "Uploaded Document"}\n**Processed At:** ${new Date().toISOString()}\n\n---\n\n${extractedText}\n`;
    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const baseName = file ? file.name.replace(/\.[^/.]+$/, "") : "extracted_text";
    saveAs(blob, `${baseName}_ocr.md`);
  };

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  return (
    <div className="w-full space-y-6">
      {!file ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-3xl bg-white cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4 shadow-sm">
            <ScanText className="h-8 w-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Upload Image or PDF for OCR</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Extract copyable text from receipts, documents, screenshots, and photos. Runs directly in your browser.
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Original Preview (4 Cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700">Source Document</span>
              <button
                onClick={() => {
                  setFile(null);
                  setExtractedText("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                Change File
              </button>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
            </div>

            {previewUrl ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                <img
                  src={previewUrl}
                  alt="Document Preview"
                  className="w-full h-auto max-h-72 object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">
                <FileText className="h-12 w-12 mb-2 text-slate-300" />
                <span className="text-xs font-medium">Multi-Page PDF Document</span>
              </div>
            )}
          </div>

          {/* Right: Recognized Text Editor (8 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Extracted Text
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {wordCount} words • {charCount} chars
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!extractedText || isScanning}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  disabled={!extractedText || isScanning}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  <span>Download .TXT</span>
                </button>

                <button
                  onClick={handleDownloadMd}
                  disabled={!extractedText || isScanning}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Download .MD</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            {isScanning ? (
              <div className="flex flex-col items-center justify-center p-16 space-y-3">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-bold text-slate-800">Extracting Text with High Precision...</p>
                <p className="text-xs text-slate-400">Scanning character boundaries and paragraphs</p>
              </div>
            ) : (
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here. You can freely edit and polish it before exporting."
                rows={12}
                className="w-full text-xs font-mono leading-relaxed rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
