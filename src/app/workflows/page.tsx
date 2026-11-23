"use client";

import React, { useState } from "react";
import { Workflow, Plus, Trash2, ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function WorkflowsPage() {
  const [pipelineSteps, setPipelineSteps] = useState<string[]>([
    "Resize to 1920x1080",
    "Compress Quality (80%)",
    "Watermark 'CONFIDENTIAL'",
    "Convert to WebP",
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-600 border border-purple-200">
          <Workflow className="h-3.5 w-3.5" />
          <span>Workflow Automation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Batch Tool Chaining & Automation Pipelines
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Save repetitive manual steps by chaining tools together. For example: batch resize 100 photographs, compress them, apply your copyright watermark, and convert to WebP in one seamless pass.
        </p>
      </div>

      {/* Preset Pipelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm space-y-4">
          <span className="rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 uppercase">
            Web Publishing Pipeline
          </span>
          <h3 className="text-lg font-bold text-slate-900">E-Commerce Image Prep</h3>
          <p className="text-xs text-slate-500">
            1. Resize to 1200px max width<br />
            2. Compress (Lossless 85%)<br />
            3. Convert to Next-Gen WebP
          </p>
          <button 
            onClick={() => setPipelineSteps(["Resize to 1200px width", "Compress Quality (85%)", "Convert to WebP"])}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 underline"
          >
            Load this pipeline ➔
          </button>
        </div>

        <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm space-y-4">
          <span className="rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-0.5 uppercase">
            Document Security
          </span>
          <h3 className="text-lg font-bold text-slate-900">Legal Document Archive</h3>
          <p className="text-xs text-slate-500">
            1. Merge incoming contract pages<br />
            2. Stamp diagonal Watermark<br />
            3. Apply Password Protection
          </p>
          <button 
            onClick={() => setPipelineSteps(["Merge Contract PDFs", "Stamp 'CONFIDENTIAL'", "Password Protect (AES-256)"])}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
          >
            Load this pipeline ➔
          </button>
        </div>

        <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm space-y-4">
          <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 uppercase">
            Social Media Blast
          </span>
          <h3 className="text-lg font-bold text-slate-900">Instagram / Stories Pack</h3>
          <p className="text-xs text-slate-500">
            1. Crop to 1:1 or 9:16 aspect ratio<br />
            2. Apply Vintage Warmth Filter<br />
            3. Compress & Export JPG
          </p>
          <button 
            onClick={() => setPipelineSteps(["Crop 9:16 Stories", "Photo Filter: Warmth", "Compress to JPG"])}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
          >
            Load this pipeline ➔
          </button>
        </div>
      </div>

      {/* Active Pipeline Visualizer */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>Active Pipeline Chain ({pipelineSteps.length} Steps)</span>
          </h2>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Zero Server Latency Mode
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 overflow-x-auto py-4">
          {pipelineSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 px-4 py-3 rounded-2xl shrink-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-purple-950">{step}</span>
              </div>
              {idx < pipelineSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-slate-300 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Execute this automated batch pipeline on your staged files.
          </p>
          <Link
            href="/tools/compress-image"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Launch Pipeline Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
