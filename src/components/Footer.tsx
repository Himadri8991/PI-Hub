import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Heart, Zap, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-500 to-orange-500 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg text-slate-900">PI Hub</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every tool you could want to edit images and documents in bulk.
              Privacy-first processing engine running 100% free and directly in your browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <Shield className="h-4 w-4" />
              <span>Zero file retention policy</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Image Studio
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools/compress-image" className="hover:text-rose-600">Compress IMAGE</Link>
              </li>
              <li>
                <Link href="/tools/resize-image" className="hover:text-rose-600">Resize IMAGE</Link>
              </li>
              <li>
                <Link href="/tools/crop-image" className="hover:text-rose-600">Crop IMAGE</Link>
              </li>
              <li>
                <Link href="/tools/convert-to-jpg" className="hover:text-rose-600">Convert to JPG</Link>
              </li>
              <li>
                <Link href="/tools/photo-editor" className="hover:text-rose-600">Photo Editor</Link>
              </li>
              <li>
                <Link href="/tools/meme-generator" className="hover:text-rose-600">Meme Generator</Link>
              </li>
              <li>
                <Link href="/tools/blur-face" className="hover:text-rose-600">Blur Face / Censor</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              PDF Studio
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools/merge-pdf" className="hover:text-orange-600">Merge PDF</Link>
              </li>
              <li>
                <Link href="/tools/split-pdf" className="hover:text-orange-600">Split PDF</Link>
              </li>
              <li>
                <Link href="/tools/compress-pdf" className="hover:text-orange-600">Compress PDF</Link>
              </li>
              <li>
                <Link href="/tools/rotate-pdf" className="hover:text-orange-600">Rotate PDF</Link>
              </li>
              <li>
                <Link href="/tools/jpg-to-pdf" className="hover:text-orange-600">JPG to PDF</Link>
              </li>
              <li>
                <Link href="/tools/watermark-pdf" className="hover:text-orange-600">Watermark PDF</Link>
              </li>
              <li>
                <Link href="/tools/protect-pdf" className="hover:text-orange-600">Protect PDF</Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Engine & Standards
            </h3>
            <div className="space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Client-Side WASM & Canvas Engine
              </p>
              <p className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-blue-500" />
                Next.js 15 + TypeScript + pdf-lib
              </p>
              <p className="pt-2 text-slate-400">
                Supports JPG, PNG, WebP, GIF, SVG, HEIC, TIFF, RAW, PDF, DOCX, and more.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} PI Hub. Built for high performance, bulk workflows, and data privacy.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
