"use client";

import React from "react";
import { TOOLS } from "@/lib/registry";
import ToolCard from "@/components/ToolCard";
import { Image as ImageIcon, Sparkles } from "lucide-react";

export default function ImageToolsPage() {
  const imageTools = TOOLS.filter((t) => t.studio === "image");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-200">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Image Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Image Processing & Optimization Tools
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Compress, resize, crop, convert, watermark, and manipulate photographs in bulk.
          Runs entirely in your browser with zero data retention and maximum speed.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {imageTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
