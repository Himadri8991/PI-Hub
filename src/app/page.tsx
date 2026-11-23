"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/registry";
import ToolCard from "@/components/ToolCard";
import { ToolCategory, StudioType } from "@/types";
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Image as ImageIcon,
  FileText,
  RefreshCw,
  FolderLock
} from "lucide-react";

export default function HomePage() {
  const [selectedStudio, setSelectedStudio] = useState<StudioType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { id: ToolCategory; label: string }[] = [
    { id: "all", label: "All Tools" },
    { id: "optimize", label: "Optimize" },
    { id: "create", label: "Create" },
    { id: "edit", label: "Edit" },
    { id: "convert", label: "Convert" },
    { id: "security", label: "Security" },
  ];

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      // Filter by Studio (image / pdf / all)
      if (selectedStudio !== "all" && tool.studio !== selectedStudio) return false;
      // Filter by Category
      if (selectedCategory !== "all" && tool.category !== selectedCategory) return false;
      // Filter by Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.shortDesc.toLowerCase().includes(q) ||
          tool.acceptedExtensions.some((ext) => ext.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedStudio, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200/80 py-16 sm:py-24">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-orange-200/40 to-blue-200/30 blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1.5 text-xs font-semibold text-rose-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            <span>The Unified iLoveIMG & iLovePDF Powerhouse</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Every tool you could want to edit{" "}
            <span className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Images & PDFs
            </span>{" "}
            in bulk.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal">
            Your high-speed online photo editor and document manager is here and forever free.
            No server limits, no cloud storage queues — processed right in your browser.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative pt-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools (e.g. compress, merge pdf, crop, watermark, convert to jpg)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white shadow-sm text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              100% Client-Side Privacy
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              Zero Upload Wait Times
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Batch ZIP Packaging
            </span>
          </div>
        </div>
      </section>

      {/* Main Studio Filter Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          {/* Studio Toggle (Image vs PDF vs All) */}
          <div className="inline-flex rounded-xl bg-slate-200/70 p-1">
            <button
              onClick={() => setSelectedStudio("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedStudio === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Studios ({TOOLS.length})
            </button>
            <button
              onClick={() => setSelectedStudio("image")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedStudio === "image"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-rose-600"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Image Studio (10)
            </button>
            <button
              onClick={() => setSelectedStudio("pdf")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedStudio === "pdf"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-orange-600"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              PDF Studio (10)
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mt-8">
          {filteredTools.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <p className="text-base font-bold text-slate-700">No tools matched your criteria.</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search query or choosing "All Tools".</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStudio("all");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Banners: Universal Converter & Automation */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Universal Converter Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-8 text-white shadow-xl">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-400/30">
                <RefreshCw className="h-3 w-3" />
                Universal Format Engine
              </span>
              <h3 className="text-2xl font-black tracking-tight">Convert Any Format</h3>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                Seamlessly convert between JPG, PNG, WebP, AVIF, GIF, SVG, HEIC, TIFF, RAW, PDF, DOCX, and more with instant compatibility checking.
              </p>
              <Link
                href="/convert"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30"
              >
                <span>Launch Converter</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Workflows Automation Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 p-8 text-white shadow-xl">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-400/30">
                <Sparkles className="h-3 w-3" />
                Workflow Pipelines
              </span>
              <h3 className="text-2xl font-black tracking-tight">Automate Chained Tasks</h3>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                Chain operations together: Resize ➔ Compress ➔ Watermark ➔ Convert to WebP in a single automated batch workflow.
              </p>
              <Link
                href="/workflows"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/30"
              >
                <span>Build Workflows</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
