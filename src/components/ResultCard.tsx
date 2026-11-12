"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Printer,
  Leaf,
} from "lucide-react";

interface ResultCardProps {
  result: {
    id: number;
    name: string;
    crop: string;
    condition: string;
    isHealthy: boolean;
    confidence: number;
    description: string;
    prevention: string;
    imageUrl?: string;
    notes?: string;
    alternatives?: Array<{ name: string; confidence: number }>;
    source?: string;
  };
  previewUrl: string;
  onReset: () => void;
}

export default function ResultCard({ result, previewUrl, onReset }: ResultCardProps) {
  const [activeTab, setActiveTab] = useState<"prevention" | "description">("prevention");

  const preventionPoints = result.prevention
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const descriptionPoints = result.description
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="surface-panel rounded-2xl p-6 sm:p-8 border border-[#1d4226] shadow-2xl relative"
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1a3821]">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              result.isHealthy
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
            }`}
          >
            {result.isHealthy ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                {result.crop} • Pathology Report
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#09130b] text-slate-300 border border-[#1a3821] font-mono">
                Class #{result.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {result.condition}
            </h2>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="flex items-center gap-3 bg-[#09130b] px-4 py-2 rounded-xl border border-[#1a3821]">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Diagnostic Confidence
            </span>
            <span className="text-xl font-bold text-white tracking-tight">
              {result.confidence}%
            </span>
          </div>
          <div className="w-10 h-10 relative flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-[#132817]"
                fill="transparent"
              />
              <motion.circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="100.5"
                initial={{ strokeDashoffset: 100.5 }}
                animate={{
                  strokeDashoffset: 100.5 - (100.5 * result.confidence) / 100,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={result.isHealthy ? "text-emerald-400" : "text-amber-400"}
                fill="transparent"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column: Analyzed Image & Summary */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <div className="surface-subtle p-2.5 rounded-xl border border-[#1a3821]">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-black flex items-center justify-center border border-[#152e1b]">
                <img
                  src={previewUrl}
                  alt="Analyzed Leaf"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-black/75 border border-white/10 flex items-center justify-between text-[11px] text-slate-200 backdrop-blur-sm">
                  <span className="truncate max-w-[150px]">Analyzed Sample</span>
                  <span className="text-emerald-400 font-mono">224×224 RGB</span>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            {result.notes && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/25 text-xs text-emerald-200 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{result.notes}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-2.5">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 py-2.5 px-4 rounded-lg btn-primary flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Scan Another Leaf</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-lg btn-secondary text-slate-300 hover:text-white"
              title="Print / Export Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Pathology & Actions Tabs */}
        <div className="md:col-span-7 flex flex-col">
          {/* Tab Selector */}
          <div className="flex border-b border-[#1a3821] gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("prevention")}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors relative ${
                activeTab === "prevention"
                  ? "text-emerald-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Treatment & Prevention</span>
              {activeTab === "prevention" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors relative ${
                activeTab === "description"
                  ? "text-emerald-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Disease Description</span>
              {activeTab === "description" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "prevention" ? (
                <motion.div
                  key="prevention"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-2.5"
                >
                  <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-2">
                    {result.isHealthy
                      ? "Agronomic Maintenance Guidelines"
                      : "Targeted Pathogen Control Protocol"}
                  </h4>

                  <ul className="space-y-2">
                    {preventionPoints.map((point, i) => (
                      <li
                        key={i}
                        className="surface-card p-3 rounded-lg text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-2.5"
                      >
                        <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-2.5"
                >
                  <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-2">
                    Clinical Symptoms & Pathology
                  </h4>

                  <div className="space-y-2">
                    {descriptionPoints.map((desc, i) => (
                      <div
                        key={i}
                        className="surface-card p-3 rounded-lg text-xs sm:text-sm text-slate-200 leading-relaxed"
                      >
                        {desc}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Alternative Candidates */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#1a3821]">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Secondary Classification Probabilities
              </span>
              <div className="flex flex-wrap gap-2">
                {result.alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-[#09130b] border border-[#1a3821] text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <span>{alt.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {alt.confidence.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
