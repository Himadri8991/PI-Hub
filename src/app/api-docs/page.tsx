"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Key, Zap, Shield, Sparkles, Code2 } from "lucide-react";

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState("pi_hub_live_sk_8f7b2c9e1a4d6e0f3b5a8c2d");
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "js">("curl");

  const generateNewKey = () => {
    const chars = "abcdef0123456789";
    let randomHex = "";
    for (let i = 0; i < 24; i++) {
      randomHex += chars[Math.floor(Math.random() * chars.length)];
    }
    setApiKey(`pi_hub_live_sk_${randomHex}`);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const curlCode = `# 1. Compress Image via REST API
curl -X POST "http://localhost:8000/api/v1/images/compress" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "file=@photo.jpg" \\
  -F "quality=80" \\
  --output "compressed_photo.jpg"

# 2. Bulk Pack Multiple Files into ZIP
curl -X POST "http://localhost:8000/api/v1/images/batch-zip" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "files=@photo1.jpg" \\
  -F "files=@photo2.png" \\
  --output "batch_archive.zip"`;

  const pythonCode = `import requests

API_KEY = "${apiKey}"
API_URL = "http://localhost:8000/api/v1/images/compress"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

# Upload and compress photograph
with open("landscape.jpg", "rb") as f:
    files = {"file": f}
    data = {"quality": 80}
    response = requests.post(API_URL, headers=headers, files=files, data=data)

if response.status_code == 200:
    with open("compressed_landscape.jpg", "wb") as out:
        out.write(response.content)
    print("Optimization successful!")`;

  const jsCode = `import fs from "fs";
import FormData from "form-data";
import axios from "axios";

const form = new FormData();
form.append("file", fs.createReadStream("document.png"));
form.append("quality", "75");

const response = await axios.post("http://localhost:8000/api/v1/images/compress", form, {
  headers: {
    ...form.getHeaders(),
    Authorization: "Bearer ${apiKey}",
  },
  responseType: "arraybuffer",
});

fs.writeFileSync("document_compressed.jpg", Buffer.from(response.data));
console.log("Processed successfully!");`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white shadow-sm">
          <Terminal className="h-3.5 w-3.5 text-rose-400" />
          <span>Developer Platform & REST API</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          PI Hub Programmatic Media API
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Integrate bulk image optimization, format conversion, and PDF pipelines into your internal software, CI/CD jobs, and apps.
        </p>
      </div>

      {/* API Key Management Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-500" />
              <span>Your Developer Sandbox Key</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Use this secret key to authenticate Bearer requests to your local FastAPI microservice.
            </p>
          </div>

          <button
            onClick={generateNewKey}
            className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            Rotate Secret Key
          </button>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
          <code className="text-xs font-mono text-slate-800 flex-1 truncate">{apiKey}</code>
          <button
            onClick={copyApiKey}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
          >
            {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Code Playground */}
      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Integration Examples</h3>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center rounded-xl bg-slate-800 p-1 text-xs font-semibold">
            {(["curl", "python", "js"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  activeTab === lang ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "js" ? "Node.js" : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative">
          <pre className="overflow-x-auto text-xs font-mono leading-relaxed text-slate-300 bg-black/40 p-5 rounded-2xl border border-slate-800">
            {activeTab === "curl" && curlCode}
            {activeTab === "python" && pythonCode}
            {activeTab === "js" && jsCode}
          </pre>
        </div>
      </div>

      {/* Endpoints Directory */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Available Microservice Endpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">POST</span>
            <p className="font-mono text-xs font-bold text-slate-900 mt-2">/api/v1/images/compress</p>
            <p className="text-xs text-slate-500">Compresses uploaded JPEG/PNG/WebP with MozJPEG quantization.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">POST</span>
            <p className="font-mono text-xs font-bold text-slate-900 mt-2">/api/v1/images/resize</p>
            <p className="text-xs text-slate-500">Fast Lanczos high-quality resampling with exact pixel bounds or scale.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">POST</span>
            <p className="font-mono text-xs font-bold text-slate-900 mt-2">/api/v1/images/batch-zip</p>
            <p className="text-xs text-slate-500">Bundles and streams multiple converted files into a downloadable archive.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
