"use client";

import React from "react";
import Link from "next/link";
import { ToolDefinition } from "@/types";
import { 
  Minimize2, 
  Maximize2, 
  Crop, 
  FileType, 
  Repeat, 
  Sliders, 
  Stamp, 
  Smile, 
  RotateCw, 
  ShieldAlert, 
  Layers, 
  Scissors, 
  FileDown, 
  FilePlus, 
  Image as ImageIcon, 
  Grid, 
  Lock, 
  FileCode,
  FileSignature,
  ScanText,
  ArrowRight
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Minimize2,
  Maximize2,
  Crop,
  FileType,
  Repeat,
  Sliders,
  Stamp,
  Smile,
  RotateCw,
  ShieldAlert,
  Layers,
  Scissors,
  FileDown,
  FilePlus,
  Image: ImageIcon,
  Grid,
  Lock,
  FileCode,
  FileSignature,
  ScanText,
};

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  const IconComponent = ICON_MAP[tool.icon] || ImageIcon;
  const isImageStudio = tool.studio === "image";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Top Accent Gradient Line on Hover */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isImageStudio 
            ? "bg-gradient-to-r from-rose-500 to-pink-500" 
            : "bg-gradient-to-r from-orange-500 to-amber-500"
        }`} 
      />

      <div>
        {/* Header: Icon + Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
              isImageStudio
                ? "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
                : "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
            }`}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          {tool.badge && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                tool.badge === "New"
                  ? "bg-emerald-100 text-emerald-800"
                  : tool.badge === "Popular"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {tool.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
          {tool.shortDesc}
        </p>
      </div>

      {/* Footer Link Indicator */}
      <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
        <span>Open tool</span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
