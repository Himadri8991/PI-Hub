"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, File as FileIcon, X, AlertCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { ToolDefinition } from "@/types";

interface UniversalDropzoneProps {
  tool: ToolDefinition;
  onFilesSelected: (files: File[]) => void;
}

export default function UniversalDropzone({ tool, onFilesSelected }: UniversalDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    const maxBytes = tool.maxFileSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Validate size
      if (file.size > maxBytes) {
        setErrorMessage(`File "${file.name}" exceeds maximum allowed size of ${tool.maxFileSizeMB} MB.`);
        continue;
      }

      // Check mime type or extension
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const matchesExt = tool.acceptedExtensions.some((e) => e.toLowerCase() === ext);
      const matchesMime = tool.acceptedMimeTypes.some((m) => file.type.startsWith(m.replace("/*", "")));

      if (!matchesExt && !matchesMime && tool.acceptedExtensions.length > 0) {
        setErrorMessage(`Unsupported format: "${file.name}". Please upload ${tool.acceptedExtensions.join(", ")}.`);
        continue;
      }

      validFiles.push(file);
      if (validFiles.length >= tool.maxFiles) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const isImage = tool.studio === "image";

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? isImage
              ? "border-rose-500 bg-rose-50/50 scale-[1.01]"
              : "border-orange-500 bg-orange-50/50 scale-[1.01]"
            : "border-slate-300 hover:border-slate-400 bg-white shadow-sm hover:shadow-md"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={tool.maxFiles > 1}
          accept={tool.acceptedExtensions.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-5 shadow-md ${
            isImage
              ? "bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-rose-500/20"
              : "bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-orange-500/20"
          }`}
        >
          <UploadCloud className="h-8 w-8 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Select or drag & drop files
        </h3>

        <p className="mt-2 text-sm text-slate-500 max-w-md">
          {tool.acceptedExtensions.map((e) => e.toUpperCase().replace(".", "")).join(", ")} up to{" "}
          <span className="font-semibold text-slate-700">{tool.maxFileSizeMB} MB</span> per file (Max{" "}
          <span className="font-semibold text-slate-700">{tool.maxFiles}</span> files).
        </p>

        <button
          type="button"
          className={`mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 ${
            isImage ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30" : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/30"
          }`}
        >
          Browse Local Files
        </button>

        <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
          <span>🔒 100% Client-Side Privacy</span>
          <span>•</span>
          <span>⚡ Zero Server Delay</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
