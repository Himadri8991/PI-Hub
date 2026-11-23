"use client";

import React, { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import { 
  RotateCw, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  FileCheck, 
  UploadCloud, 
  RefreshCw,
  Loader2
} from "lucide-react";

interface PageItem {
  pageIndex: number;
  displayNumber: number;
  rotation: number;
  isDeleted: boolean;
}

export default function PDFPageOrganizer() {
  const [file, setFile] = useState<File | null>(null);
  const [pageItems, setPageItems] = useState<PageItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const handleFileUpload = async (uploadedFile: File) => {
    setIsLoadingPdf(true);
    setFile(uploadedFile);
    try {
      const buffer = await uploadedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const count = pdf.getPageCount();
      setTotalPages(count);

      const items: PageItem[] = [];
      for (let i = 0; i < count; i++) {
        items.push({
          pageIndex: i,
          displayNumber: i + 1,
          rotation: pdf.getPage(i).getRotation().angle,
          isDeleted: false,
        });
      }
      setPageItems(items);
    } catch (err: any) {
      alert(`Failed to load PDF: ${err.message || err}`);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const rotatePage = (idx: number) => {
    setPageItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const toggleDelete = (idx: number) => {
    setPageItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, isDeleted: !item.isDeleted } : item
      )
    );
  };

  const movePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pageItems.length) return;
    setPageItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleSaveAndExport = async () => {
    if (!file) return;
    setIsExporting(true);

    try {
      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      const activePages = pageItems.filter((p) => !p.isDeleted);
      if (activePages.length === 0) {
        alert("Cannot export empty document. Please keep at least one page.");
        setIsExporting(false);
        return;
      }

      for (const item of activePages) {
        const [copiedPage] = await newPdf.copyPages(srcPdf, [item.pageIndex]);
        copiedPage.setRotation(degrees(item.rotation));
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      saveAs(blob, `${baseName}_organized.pdf`);
    } catch (err: any) {
      alert(`Export error: ${err.message || err}`);
    } finally {
      setIsExporting(false);
    }
  };

  const activeCount = pageItems.filter((p) => !p.isDeleted).length;

  return (
    <div className="w-full space-y-6">
      {!file ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-orange-300 rounded-3xl bg-orange-50/50 cursor-pointer hover:bg-orange-50 transition-colors text-center">
          <UploadCloud className="h-12 w-12 text-orange-500 mb-3 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-900">Upload PDF to Organize</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Visual page grid: delete unwanted pages, rotate upside-down sheets, and reorder document flow.
          </p>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
        </label>
      ) : (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-400">
                {activeCount} of {totalPages} pages selected for export
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFile(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2"
              >
                Choose Different PDF
              </button>

              <button
                disabled={isExporting || activeCount === 0}
                onClick={handleSaveAndExport}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-700 transition-transform hover:scale-105 active:scale-95 disabled:bg-slate-300"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export {activeCount} Pages</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pageItems.map((item, idx) => (
              <div
                key={item.pageIndex}
                className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl border transition-all ${
                  item.isDeleted
                    ? "bg-slate-100 border-slate-200 opacity-40 scale-95"
                    : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300"
                }`}
              >
                {/* Simulated Thumbnail Sheet */}
                <div
                  className="relative flex items-center justify-center w-full aspect-[1/1.4] bg-slate-50 border border-slate-200 rounded-lg overflow-hidden transition-transform duration-300"
                  style={{ transform: `rotate(${item.rotation}deg)` }}
                >
                  <FileCheck className="h-8 w-8 text-slate-300" />
                  <div className="absolute inset-x-2 top-3 h-1 bg-slate-200 rounded" />
                  <div className="absolute inset-x-2 top-5 h-1 bg-slate-200 rounded" />
                  <div className="absolute inset-x-2 top-7 h-1 bg-slate-200 rounded" />
                  <div className="absolute inset-x-2 top-9 h-1 bg-slate-200 rounded w-2/3" />
                </div>

                {/* Page Number Label */}
                <span className="mt-2 text-xs font-bold text-slate-700">
                  Page {item.displayNumber}
                </span>

                {/* Per-Page Action Icons */}
                <div className="mt-3 flex items-center justify-center gap-1.5 w-full pt-2 border-t border-slate-100">
                  {/* Move Left */}
                  <button
                    disabled={idx === 0}
                    onClick={() => movePage(idx, idx - 1)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Move page left"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>

                  {/* Rotate 90 deg */}
                  <button
                    onClick={() => rotatePage(idx)}
                    className="p-1 text-slate-400 hover:text-orange-600"
                    title="Rotate 90 degrees"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>

                  {/* Move Right */}
                  <button
                    disabled={idx === pageItems.length - 1}
                    onClick={() => movePage(idx, idx + 1)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Move page right"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  {/* Delete / Restore */}
                  <button
                    onClick={() => toggleDelete(idx)}
                    className={`p-1 ${
                      item.isDeleted ? "text-emerald-600" : "text-slate-400 hover:text-rose-600"
                    }`}
                    title={item.isDeleted ? "Restore page" : "Remove page"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
