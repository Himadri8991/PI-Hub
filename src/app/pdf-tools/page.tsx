"use client";

import React from "react";
import { TOOLS } from "@/lib/registry";
import ToolCard from "@/components/ToolCard";
import { FileText } from "lucide-react";

export default function PdfToolsPage() {
  const pdfTools = TOOLS.filter((t) => t.studio === "pdf");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200">
          <FileText className="h-3.5 w-3.5" />
          <span>PDF Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          PDF Document Tools
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Merge, split, compress, rotate, organize, protect, and convert PDF documents.
          Safe, enterprise-grade client-side operations that keep your confidential documents private.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pdfTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
