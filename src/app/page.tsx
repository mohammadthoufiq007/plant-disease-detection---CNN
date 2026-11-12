"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  Leaf,
  Scan,
  AlertCircle,
  Sparkles,
  Cpu,
  Layers,
  Activity,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CameraCapture from "@/components/CameraCapture";
import ResultCard from "@/components/ResultCard";
import SampleLeaves from "@/components/SampleLeaves";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis steps shown during animated scan
  const SCAN_STEPS = [
    "Preprocessing & normalizing 224×224 RGB channels...",
    "Extracting deep feature maps via Conv2D blocks...",
    "Scanning leaf surface for pathological lesions...",
    "Calculating softmax probabilities across 39 classes...",
  ];

  // Handle file selection
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, or WEBP)");
      return;
    }
    setError(null);
    setResult(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle 1-click sample selection
  const handleSelectSample = async (imageSrc: string, filename: string) => {
    try {
      setError(null);
      setResult(null);
      setPreviewUrl(imageSrc);

      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/jpeg" });
      setSelectedFile(file);
    } catch (err) {
      console.error("Failed to load sample:", err);
    }
  };

  // Handle analyze trigger
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisStep(0);

    const interval = setInterval(() => {
      setAnalysisStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      if (apiKey) {
        formData.append("apiKey", apiKey);
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze leaf image");
      }

      const data = await res.json();

      setTimeout(() => {
        clearInterval(interval);
        setIsAnalyzing(false);
        setResult(data);
      }, 1500);
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setError(err.message || "An error occurred during diagnosis.");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ambient">
      <Navbar apiKey={apiKey} setApiKey={setApiKey} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PyTorch Convolutional Neural Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            AI Crop Leaf Health &{" "}
            <span className="text-emerald-400">
              Disease Diagnostic
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Upload any crop leaf photo to identify diseases, evaluate health status, and generate clinical treatment guidelines across 39 PlantVillage categories.
          </p>
        </div>

        {/* Feature Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {[
            { icon: Cpu, label: "PyTorch CNN Backbone", desc: "4 Conv2D + BatchNorm blocks" },
            { icon: Layers, label: "39 Plant Categories", desc: "14 crop species supported" },
            { icon: Scan, label: "Live Visual Preview", desc: "Instant camera & file check" },
            { icon: Activity, label: "Actionable Insights", desc: "Immediate treatment protocols" },
          ].map((item, idx) => (
            <div key={idx} className="surface-card p-3 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <item.icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{item.label}</h4>
                <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Camera Modal */}
        <AnimatePresence>
          {showCamera && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <CameraCapture
                onCapture={(file, url) => {
                  setSelectedFile(file);
                  setPreviewUrl(url);
                  setResult(null);
                  setShowCamera(false);
                }}
                onClose={() => setShowCamera(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Diagnostic Panel */}
        <div className="max-w-4xl mx-auto">
          {!result ? (
            <div className="surface-panel rounded-2xl p-6 sm:p-8 border border-[#1a3821] shadow-2xl relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !previewUrl && fileInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed transition-all p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[300px] ${
                  isDragOver
                    ? "border-emerald-400 bg-emerald-950/25"
                    : "border-[#20442a] hover:border-emerald-500/50 bg-[#09130b]"
                } ${!previewUrl ? "cursor-pointer" : ""}`}
              >
                {previewUrl ? (
                  /* Preview with Scan Line when Analyzing */
                  <div className="relative w-full max-w-sm aspect-square rounded-xl overflow-hidden shadow-2xl bg-black border border-emerald-500/40">
                    <img
                      src={previewUrl}
                      alt="Selected Leaf"
                      className="w-full h-full object-contain"
                    />

                    {/* Animated Scanning Laser Bar */}
                    {isAnalyzing && (
                      <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: "90%" }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] z-10"
                      />
                    )}

                    {/* Processing Overlay */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                          className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent mb-3"
                        />
                        <span className="text-sm font-bold text-white mb-1">
                          Analyzing Leaf Features
                        </span>
                        <p className="text-xs text-emerald-300 font-mono">
                          {SCAN_STEPS[analysisStep]}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-3.5">
                      <Upload className="w-7 h-7" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      Choose or Drag & Drop Leaf Image
                    </h3>
                    <p className="text-xs text-slate-300 max-w-sm mb-3">
                      Upload clear photo of crop foliage (JPG, PNG, WEBP)
                    </p>
                    <span className="px-2.5 py-0.5 rounded bg-[#112215] text-emerald-400 border border-[#1a3821] text-xs font-mono">
                      Target Input: 224×224 RGB
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="px-4 py-2 rounded-lg btn-secondary text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>{previewUrl ? "Change Image" : "Choose File"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    disabled={isAnalyzing}
                    className="px-4 py-2 rounded-lg btn-secondary text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Open Camera</span>
                  </button>
                </div>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Scan className="w-4 h-4" />
                    <span>{isAnalyzing ? "Processing..." : "Analyze Disease"}</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Sample Leaves Quick Selector */}
              <SampleLeaves onSelectSample={handleSelectSample} disabled={isAnalyzing} />
            </div>
          ) : (
            /* Result Card */
            <ResultCard result={result} previewUrl={previewUrl!} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a3821] py-6 text-center text-xs text-slate-400 bg-[#060d08]">
        <p className="mb-1 text-slate-300">
          🌿 Plant Disease Detection CNN • Next.js, React & Tailwind CSS
        </p>
        <p className="text-[11px] text-emerald-400/80">
          PlantVillage Benchmark Dataset (39 Disease Categories) • Vercel Ready
        </p>
      </footer>
    </div>
  );
}
