"use client";

import React, { useState } from "react";
import { FORMAT_MATRIX } from "@/lib/registry";
import { RefreshCw, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ConvertHubPage() {
  const [selectedSource, setSelectedSource] = useState("JPG");
  const [selectedTarget, setSelectedTarget] = useState("PNG");

  const currentSourceItem = FORMAT_MATRIX.find((m) => m.format === selectedSource);
  const compatibleOutputs = currentSourceItem?.convertibleTo || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-200">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Universal Format Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Universal File Conversion Matrix
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Select your input file format to view guaranteed compatible conversion paths across raster, vector, raw, and document formats.
        </p>
      </div>

      {/* Interactive Compatibility Matrix Selector */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-8">
        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
          Step 1: Choose Source Format
        </h2>

        {/* Source Pills */}
        <div className="flex flex-wrap gap-2.5">
          {FORMAT_MATRIX.map((item) => (
            <button
              key={item.format}
              onClick={() => {
                setSelectedSource(item.format);
                setSelectedTarget(item.convertibleTo[0] || "");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedSource === item.format
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item.format} ({item.name})
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
            Step 2: Choose Target Output Format
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {compatibleOutputs.map((outFmt) => (
              <button
                key={outFmt}
                onClick={() => setSelectedTarget(outFmt)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTarget === outFmt
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                ➔ {outFmt}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Action Card */}
        <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
              {selectedSource}
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-sm">
              {selectedTarget}
            </div>
            <div className="ml-2">
              <p className="text-sm font-bold text-slate-900">
                Convert {selectedSource} to {selectedTarget}
              </p>
              <p className="text-xs text-slate-500">Lossless & optimized client pipeline</p>
            </div>
          </div>

          <Link
            href={
              selectedSource === "PDF" && selectedTarget === "JPG"
                ? "/tools/pdf-to-jpg"
                : selectedTarget === "PDF"
                ? "/tools/jpg-to-pdf"
                : selectedTarget === "JPG"
                ? "/tools/convert-to-jpg"
                : "/tools/jpg-to-image"
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
          >
            <span>Open {selectedSource} to {selectedTarget} Converter</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
