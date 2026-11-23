"useclient";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  RefreshCw, 
  Workflow, 
  ShieldCheck, 
  Github,
  Terminal,
  Menu,
  X
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-blue-600 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                PI <span className="text-rose-600">Hub</span>
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">iLoveIMG + iLovePDF Suite</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link
            href="/image-tools"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <ImageIcon className="h-4 w-4 text-rose-500" />
            Image Studio
          </Link>
          <Link
            href="/pdf-tools"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <FileText className="h-4 w-4 text-orange-500" />
            PDF Studio
          </Link>
          <Link
            href="/convert"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-blue-500" />
            Convert Hub
          </Link>
          <Link
            href="/workflows"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-purple-600 hover:bg-purple-50 transition-colors"
          >
            <Workflow className="h-4 w-4 text-purple-500" />
            Workflows
          </Link>
          <Link
            href="/api-docs"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Terminal className="h-4 w-4 text-slate-500" />
            API
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-full border border-emerald-200 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Client Privacy</span>
          </div>
          <Link
            href="/image-tools"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            Explore 30+ Tools
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/image-tools"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-rose-50 hover:text-rose-600"
          >
            <ImageIcon className="h-5 w-5 text-rose-500" />
            Image Studio
          </Link>
          <Link
            href="/pdf-tools"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-orange-50 hover:text-orange-600"
          >
            <FileText className="h-5 w-5 text-orange-500" />
            PDF Studio
          </Link>
          <Link
            href="/convert"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-600"
          >
            <RefreshCw className="h-5 w-5 text-blue-500" />
            Universal Convert Hub
          </Link>
          <Link
            href="/workflows"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-purple-50 hover:text-purple-600"
          >
            <Workflow className="h-5 w-5 text-purple-500" />
            Automated Workflows
          </Link>
          <Link
            href="/api-docs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
          >
            <Terminal className="h-5 w-5 text-slate-500" />
            Developer REST API
          </Link>
        </div>
      )}
    </header>
  );
}
