"use client";

import React, { useRef, useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { 
  FileSignature, 
  UploadCloud, 
  Eraser, 
  Download, 
  CheckCircle2, 
  Move, 
  PenTool, 
  Type, 
  Image as ImageIcon,
  Loader2
} from "lucide-react";

export default function PDFSigner() {
  const [file, setFile] = useState<File | null>(null);
  const [signatureMode, setSignatureMode] = useState<"draw" | "type">("draw");
  const [penColor, setPenColor] = useState("#000000");
  const [typedName, setTypedName] = useState("John Doe");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [stampPosition, setStampPosition] = useState({ x: 50, y: 70 }); // % of page
  const [targetPage, setTargetPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  // Load PDF metadata
  const handlePdfUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    try {
      const buffer = await uploadedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setPageCount(pdf.getPageCount());
    } catch (err: any) {
      alert(`Could not parse PDF: ${err.message || err}`);
    }
  };

  // Drawing canvas logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [penColor, signatureMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  // Generate typed signature image
  const generateTypedSignature = () => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 400;
    tempCanvas.height = 150;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    ctx.font = "italic 48px 'Brush Script MT', 'Dancing Script', cursive, sans-serif";
    ctx.fillStyle = penColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedName, 200, 75);
    setSignatureDataUrl(tempCanvas.toDataURL("image/png"));
  };

  // Stamp signature onto PDF
  const handleSignAndDownload = async () => {
    if (!file || !signatureDataUrl) return;
    setIsExporting(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);

      // Embed signature image
      const sigImageBytes = await fetch(signatureDataUrl).then((res) => res.arrayBuffer());
      const embeddedSig = await pdf.embedPng(sigImageBytes);

      const targetPageIndex = Math.max(0, Math.min(pageCount - 1, targetPage - 1));
      const page = pdf.getPage(targetPageIndex);
      const { width: pageW, height: pageH } = page.getSize();

      const sigWidth = 150;
      const sigHeight = (sigWidth / embeddedSig.width) * embeddedSig.height;

      // Calculate absolute points from percentages
      const posX = (stampPosition.x / 100) * (pageW - sigWidth);
      const posY = ((100 - stampPosition.y) / 100) * (pageH - sigHeight);

      page.drawImage(embeddedSig, {
        x: posX,
        y: posY,
        width: sigWidth,
        height: sigHeight,
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      saveAs(blob, `${baseName}_signed.pdf`);
    } catch (err: any) {
      alert(`Signing error: ${err.message || err}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {!file ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-3xl bg-white cursor-pointer hover:border-orange-500 hover:bg-orange-50/30 transition-all text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-4 shadow-sm">
            <FileSignature className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Upload PDF to Sign</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Draw your signature, choose placement, and apply valid visual e-signatures onto contracts and forms.
          </p>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handlePdfUpload(e.target.files[0]);
            }}
          />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Signature Creation Pad (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-orange-500" />
                  <span>Create Your Signature</span>
                </h3>
                {/* Mode Selector */}
                <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setSignatureMode("draw")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      signatureMode === "draw" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                    }`}
                  >
                    Draw
                  </button>
                  <button
                    onClick={() => {
                      setSignatureMode("type");
                      generateTypedSignature();
                    }}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      signatureMode === "type" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                    }`}
                  >
                    Type
                  </button>
                </div>
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">Ink Color:</span>
                {["#000000", "#1e3a8a", "#991b1b"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPenColor(color)}
                    className={`h-6 w-6 rounded-full border-2 transition-transform ${
                      penColor === color ? "scale-110 border-slate-800" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Draw Mode Canvas */}
              {signatureMode === "draw" ? (
                <div className="space-y-2">
                  <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={380}
                      height={160}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full h-40 cursor-crosshair touch-none"
                    />
                    <span className="absolute bottom-2 left-3 text-[10px] text-slate-400 pointer-events-none select-none">
                      Sign here using mouse or touchscreen
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={clearCanvas}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 font-medium"
                    >
                      <Eraser className="h-3.5 w-3.5" />
                      <span>Clear Ink</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Type Mode Input */
                <div className="space-y-4">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => {
                      setTypedName(e.target.value);
                      generateTypedSignature();
                    }}
                    placeholder="Enter your name..."
                    className="w-full text-sm font-medium rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 text-center">
                    <span
                      className="text-4xl italic"
                      style={{
                        fontFamily: "'Brush Script MT', 'Dancing Script', cursive, sans-serif",
                        color: penColor,
                      }}
                    >
                      {typedName || "Signature Preview"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Position Settings & Execution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Move className="h-4 w-4 text-orange-500" />
                <span>Signature Placement</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-1.5">Apply to Page</label>
                  <select
                    value={targetPage}
                    onChange={(e) => setTargetPage(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-800"
                  >
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Page {i + 1} of {pageCount}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5">Preset Anchor</label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "bottom-right") setStampPosition({ x: 70, y: 85 });
                      if (val === "bottom-left") setStampPosition({ x: 15, y: 85 });
                      if (val === "center") setStampPosition({ x: 45, y: 50 });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-800"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="center">Center of Page</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  disabled={!signatureDataUrl || isExporting}
                  onClick={handleSignAndDownload}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md transition-transform hover:scale-105 active:scale-95 disabled:bg-slate-300"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Embedding Signature...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Apply Signature & Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Simulated Document Page Preview (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-bold text-slate-700">
                Placement Preview (Page {targetPage} of {pageCount})
              </span>
              <button
                onClick={() => setFile(null)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Change PDF
              </button>
            </div>

            {/* Virtual A4 Sheet Canvas */}
            <div className="relative w-full max-w-md aspect-[1/1.4] bg-white border border-slate-300 shadow-xl rounded-lg p-8 overflow-hidden select-none">
              {/* Document Mockup Text Lines */}
              <div className="space-y-3 opacity-25 pointer-events-none">
                <div className="h-4 bg-slate-400 rounded w-1/3 mb-6" />
                <div className="h-2 bg-slate-300 rounded w-full" />
                <div className="h-2 bg-slate-300 rounded w-full" />
                <div className="h-2 bg-slate-300 rounded w-4/5" />
                <div className="h-2 bg-slate-300 rounded w-full" />
                <div className="h-2 bg-slate-300 rounded w-2/3" />
                <div className="h-2 bg-slate-300 rounded w-full pt-8" />
                <div className="h-2 bg-slate-300 rounded w-full" />
                <div className="h-2 bg-slate-300 rounded w-3/4" />
              </div>

              {/* Signature Stamp Badge */}
              {signatureDataUrl && (
                <div
                  className="absolute p-1 border-2 border-dashed border-orange-500 rounded bg-orange-50/50 shadow-sm"
                  style={{
                    left: `${stampPosition.x}%`,
                    top: `${stampPosition.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <img
                    src={signatureDataUrl}
                    alt="Signature"
                    className="h-10 w-28 object-contain"
                  />
                  <div className="text-[9px] font-bold text-orange-600 text-center">
                    Signed Page {targetPage}
                  </div>
                </div>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-400 text-center max-w-sm">
              Use the preset anchor options on the left to set where your signature will be permanently stamped.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
