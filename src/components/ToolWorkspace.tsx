"use client";

import React, { useState } from "react";
import { ToolDefinition, StagedFile } from "@/types";
import UniversalDropzone from "@/components/UniversalDropzone";
import PDFPageOrganizer from "@/components/PDFPageOrganizer";
import PDFSigner from "@/components/PDFSigner";
import OCRScanner from "@/components/OCRScanner";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { formatBytes } from "@/lib/utils";
import { processImageTool } from "@/lib/image-processor";
import { mergePDFs, splitPDF, rotatePDF, watermarkPDF, imagesToPDF } from "@/lib/pdf-processor";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { 
  FileCheck, 
  Trash2, 
  Plus, 
  Download, 
  Archive, 
  Loader2, 
  Settings2, 
  CheckCircle2, 
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Eye,
  X
} from "lucide-react";
import Link from "next/link";

export default function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [options, setOptions] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    Object.entries(tool.optionsSchema).forEach(([key, field]) => {
      initial[key] = field.default;
    });
    return initial;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [overallDone, setOverallDone] = useState(false);
  const [comparisonModal, setComparisonModal] = useState<{ originalUrl: string; processedUrl: string; name: string } | null>(null);

  const isImageStudio = tool.studio === "image";

  const handleFilesAdded = (files: File[]) => {
    const newItems: StagedFile[] = files.map((f) => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      status: "idle",
      progress: 0,
    }));
    setStagedFiles((prev) => [...prev, ...newItems]);
    setOverallDone(false);
  };

  const removeFile = (id: string) => {
    setStagedFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAllFiles = () => {
    stagedFiles.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setStagedFiles([]);
    setOverallDone(false);
  };

  const handleOptionChange = (key: string, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  // Run the batch execution engine
  const handleProcess = async () => {
    if (stagedFiles.length === 0 || isProcessing) return;
    setIsProcessing(true);

    try {
      if (tool.id === "merge-pdf") {
        // Special case: Multiple PDFs combined into 1 output
        const filesOnly = stagedFiles.map((s) => s.file);
        const { blob, outputName } = await mergePDFs(filesOnly);

        setStagedFiles((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: "completed",
            progress: 100,
            outputBlob: idx === 0 ? blob : undefined,
            outputName: idx === 0 ? outputName : undefined,
            outputSize: idx === 0 ? blob.size : undefined,
          }))
        );
      } else if (tool.id === "jpg-to-pdf") {
        // Special case: Multiple images combined into 1 PDF
        const filesOnly = stagedFiles.map((s) => s.file);
        const { blob, outputName } = await imagesToPDF(filesOnly, options);

        setStagedFiles((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: "completed",
            progress: 100,
            outputBlob: idx === 0 ? blob : undefined,
            outputName: idx === 0 ? outputName : undefined,
            outputSize: idx === 0 ? blob.size : undefined,
          }))
        );
      } else {
        // Standard per-file batch processing
        const updated = [...stagedFiles];

        for (let i = 0; i < updated.length; i++) {
          updated[i].status = "processing";
          setStagedFiles([...updated]);

          let resultBlob: Blob;
          let resultName: string;

          if (isImageStudio) {
            const res = await processImageTool(tool.id, updated[i].file, options);
            resultBlob = res.blob;
            resultName = res.outputName;
          } else {
            // PDF operations
            if (tool.id === "split-pdf") {
              const res = await splitPDF(updated[i].file, options);
              resultBlob = res.blob;
              resultName = res.outputName;
            } else if (tool.id === "rotate-pdf") {
              const res = await rotatePDF(updated[i].file, options);
              resultBlob = res.blob;
              resultName = res.outputName;
            } else if (tool.id === "watermark-pdf") {
              const res = await watermarkPDF(updated[i].file, options);
              resultBlob = res.blob;
              resultName = res.outputName;
            } else {
              // Fallback pass-through
              resultBlob = updated[i].file;
              resultName = updated[i].name;
            }
          }

          updated[i].status = "completed";
          updated[i].progress = 100;
          updated[i].outputBlob = resultBlob;
          updated[i].outputName = resultName;
          updated[i].outputSize = resultBlob.size;
          setStagedFiles([...updated]);
        }
      }
      setOverallDone(true);
    } catch (err: any) {
      console.error(err);
      alert(`Processing error: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    const zip = new JSZip();
    let hasOutputs = false;

    stagedFiles.forEach((item) => {
      if (item.outputBlob && item.outputName) {
        zip.file(item.outputName, item.outputBlob);
        hasOutputs = true;
      }
    });

    if (!hasOutputs) return;
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${tool.slug}_batch_results.zip`);
  };

  const handleDownloadSingle = (fileItem: StagedFile) => {
    if (fileItem.outputBlob && fileItem.outputName) {
      saveAs(fileItem.outputBlob, fileItem.outputName);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button & tool header */}
      <div className="mb-8">
        <Link
          href={isImageStudio ? "/image-tools" : "/pdf-tools"}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to {isImageStudio ? "Image Studio" : "PDF Studio"}</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {tool.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">{tool.longDesc}</p>
          </div>
          {stagedFiles.length > 0 && (
            <button
              onClick={clearAllFiles}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-2 rounded-lg"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All ({stagedFiles.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Special Case: Interactive PDF Page Organizer, Signer & OCR Scanner */}
      {tool.id === "organize-pdf" ? (
        <PDFPageOrganizer />
      ) : tool.id === "sign-pdf" ? (
        <PDFSigner />
      ) : tool.id === "ocr-pdf" ? (
        <OCRScanner />
      ) : stagedFiles.length === 0 ? (
        <UniversalDropzone tool={tool} onFilesSelected={handleFilesAdded} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Queue List / Grid (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                Staged Files ({stagedFiles.length} of {tool.maxFiles})
              </span>
              <label
                className={`cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold ${
                  isImageStudio ? "text-rose-600" : "text-orange-600"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Add More</span>
                <input
                  type="file"
                  multiple
                  accept={tool.acceptedExtensions.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFilesAdded(Array.from(e.target.files));
                  }}
                />
              </label>
            </div>

            <div className="space-y-3">
              {stagedFiles.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Thumbnail or File Icon */}
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                          isImageStudio ? "bg-rose-50 text-rose-500" : "bg-orange-50 text-orange-500"
                        }`}
                      >
                        <FileCheck className="h-6 w-6" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span>Original: {formatBytes(item.size)}</span>
                        {item.outputSize && (
                          <>
                            <span>→</span>
                            <span className="font-semibold text-emerald-600">
                              {formatBytes(item.outputSize)} (
                              {Math.round(((item.outputSize - item.size) / item.size) * 100)}%)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-3">
                    {item.status === "processing" && (
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    )}
                    {item.status === "completed" && item.outputBlob && (
                      <>
                        {item.previewUrl && isImageStudio && (
                          <button
                            onClick={() =>
                              setComparisonModal({
                                originalUrl: item.previewUrl!,
                                processedUrl: URL.createObjectURL(item.outputBlob!),
                                name: item.name,
                              })
                            }
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Interactive Before/After Slider"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Compare</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadSingle(item)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Inspector: Options & Execution (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                <Settings2 className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Tool Settings
                </h3>
              </div>

              {/* Dynamic options schema controls */}
              <div className="space-y-5">
                {Object.keys(tool.optionsSchema).length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No custom settings required. Default optimal configuration applied automatically.
                  </p>
                ) : (
                  Object.entries(tool.optionsSchema).map(([key, field]) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <label>{field.label}</label>
                        {field.type === "slider" && (
                          <span className="text-slate-500">
                            {options[key]}
                            {field.unit}
                          </span>
                        )}
                      </div>

                      {field.type === "slider" && (
                        <input
                          type="range"
                          min={field.min}
                          max={field.max}
                          step={field.step || 1}
                          value={options[key]}
                          onChange={(e) => handleOptionChange(key, Number(e.target.value))}
                          className="w-full accent-rose-600"
                        />
                      )}

                      {field.type === "select" && (
                        <select
                          value={options[key]}
                          onChange={(e) => handleOptionChange(key, e.target.value)}
                          className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "text" && (
                        <input
                          type="text"
                          value={options[key]}
                          onChange={(e) => handleOptionChange(key, e.target.value)}
                          className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      )}

                      {field.type === "color" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={options[key]}
                            onChange={(e) => handleOptionChange(key, e.target.value)}
                            className="h-9 w-14 rounded-lg cursor-pointer border border-slate-200"
                          />
                          <span className="text-xs font-mono text-slate-500">{options[key]}</span>
                        </div>
                      )}

                      {field.type === "boolean" && (
                        <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={options[key]}
                            onChange={(e) => handleOptionChange(key, e.target.checked)}
                            className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                          />
                          <span className="text-xs font-medium text-slate-600">
                            {field.description || field.label}
                          </span>
                        </label>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                {!overallDone ? (
                  <button
                    disabled={isProcessing || stagedFiles.length === 0}
                    onClick={handleProcess}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-all ${
                      isProcessing
                        ? "bg-slate-400 cursor-not-allowed"
                        : isImageStudio
                        ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30 hover:scale-[1.02] active:scale-98"
                        : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/30 hover:scale-[1.02] active:scale-98"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing {stagedFiles.length} files...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Process {stagedFiles.length} Files Now</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>All {stagedFiles.length} files processed successfully!</span>
                    </div>

                    <button
                      onClick={handleDownloadAllZip}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-transform hover:scale-[1.02] active:scale-98"
                    >
                      <Archive className="h-4 w-4" />
                      <span>Download All as ZIP</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Interactive Quality Comparison Modal */}
      {comparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive Before & After Comparison
                </h3>
                <p className="text-xs text-slate-400">{comparisonModal.name}</p>
              </div>
              <button
                onClick={() => setComparisonModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <BeforeAfterSlider
              originalSrc={comparisonModal.originalUrl}
              processedSrc={comparisonModal.processedUrl}
              originalLabel="Original"
              processedLabel="Optimized / Processed"
              className="max-h-[500px]"
            />

            <p className="text-center text-xs text-slate-400">
              Drag the center slider left and right to inspect compression fidelity and pixel sharpness.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
