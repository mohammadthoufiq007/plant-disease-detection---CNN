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
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Image as ImageIcon,
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
    "Preprocessing & resizing to 224×224 RGB...",
    "Running forward pass through 4 Conv2D blocks...",
    "Extracting deep feature maps & batch norm...",
    "Calculating softmax probabilities across 39 classes...",
  ];

  // Handle file selection
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WEBP)");
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

    // Animate step progress
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
      
      // Allow scan animation to feel satisfying (minimum 1.5s)
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
    <div className="min-h-screen flex flex-col">
      <Navbar apiKey={apiKey} setApiKey={setApiKey} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Leaf Diagnostics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight"
          >
            Diagnose Crop Diseases in{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent">
              Seconds
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto"
          >
            Upload any crop leaf photo to identify pathological infections, obtain instant confidence scores, and receive tailored organic and chemical prevention plans.
          </motion.p>
        </div>

        {/* Feature Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {[
            { icon: Cpu, label: "PyTorch CNN Architecture", desc: "4 Conv2D + BatchNorm blocks" },
            { icon: Layers, label: "39 Plant Categories", desc: "14 crop species supported" },
            { icon: Scan, label: "Live Visual Preview", desc: "Instant camera & file check" },
            { icon: Activity, label: "Immediate Results", desc: "Actionable prevention steps" },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-3 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
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

        {/* Main Diagnostic Area */}
        <div className="max-w-4xl mx-auto">
          {!result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/20 shadow-2xl relative"
            >
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
                className={`relative rounded-2xl border-2 border-dashed transition-all p-6 sm:p-10 text-center flex flex-col items-center justify-center min-h-[320px] ${
                  isDragOver
                    ? "border-emerald-400 bg-emerald-500/15 scale-[1.01]"
                    : "border-emerald-500/30 hover:border-emerald-400/60 bg-slate-900/40"
                } ${!previewUrl ? "cursor-pointer" : ""}`}
              >
                {previewUrl ? (
                  /* Preview with Scan Line when Analyzing */
                  <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl bg-black border border-emerald-500/40">
                    <img
                      src={previewUrl}
                      alt="Selected Leaf"
                      className="w-full h-full object-contain"
                    />

                    {/* Animated Scanning Radar Bar */}
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
                        className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] z-10"
                      >
                        <div className="absolute inset-0 bg-emerald-300 blur-sm" />
                      </motion.div>
                    )}

                    {/* Status Overlay while analyzing */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent mb-3"
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
                  /* Empty State Prompt */
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10"
                    >
                      <Upload className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Choose or Drag & Drop Leaf Image
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-4">
                      Supports high-resolution JPG, PNG or WEBP from phones, drones, or cameras
                    </p>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                      Target resolution: 224×224 RGB
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>{previewUrl ? "Change Image" : "Choose File"}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowCamera(true)}
                    disabled={isAnalyzing}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Use Camera</span>
                  </motion.button>
                </div>

                {previewUrl && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                  >
                    <Scan className="w-4 h-4" />
                    <span>{isAnalyzing ? "Processing..." : "Analyze Disease"}</span>
                  </motion.button>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Sample leaves quick-select */}
              <SampleLeaves onSelectSample={handleSelectSample} disabled={isAnalyzing} />
            </motion.div>
          ) : (
            /* Result Card */
            <ResultCard result={result} previewUrl={previewUrl!} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-500/15 py-6 text-center text-xs text-slate-400">
        <p className="mb-1">
          🌿 Plant Disease Detection CNN • Next.js, Tailwind CSS, & Framer Motion
        </p>
        <p className="text-[11px] text-emerald-500/70">
          PlantVillage Benchmark Dataset (39 Categories) • Ready for Vercel
        </p>
      </footer>
    </div>
  );
}
