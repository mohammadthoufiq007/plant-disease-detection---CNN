"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  RotateCcw,
  Share2,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink,
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
    .filter((p) => p.trim().length > 0);

  const descriptionPoints = result.description
    .split("\n")
    .filter((p) => p.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 shadow-2xl relative overflow-hidden"
    >
      {/* Top Banner Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-emerald-500/15">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              result.isHealthy
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {result.isHealthy ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400/90">
                {result.crop} Diagnosis
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Class #{result.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {result.condition}
            </h2>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
              Confidence Score
            </span>
            <span className="text-2xl font-black text-emerald-300 tracking-tight">
              {result.confidence}%
            </span>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-800"
                fill="transparent"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="125.6"
                initial={{ strokeDashoffset: 125.6 }}
                animate={{
                  strokeDashoffset: 125.6 - (125.6 * result.confidence) / 100,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={result.isHealthy ? "text-emerald-400" : "text-amber-400"}
                fill="transparent"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Grid: Uploaded Leaf & Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        
        {/* Left: Uploaded Leaf Image */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className="relative rounded-2xl overflow-hidden glass-card p-2 border border-emerald-500/20 group">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Analyzed Leaf"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-slate-200">
                <span className="truncate max-w-[150px]">Analyzed Sample</span>
                <span className="text-[10px] text-emerald-400 font-mono">224x224 RGB</span>
              </div>
            </div>
          </div>

          {/* Observations Banner */}
          {result.notes && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{result.notes}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReset}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Scan Another Leaf</span>
            </motion.button>
          </div>
        </div>

        {/* Right: Pathological Details & Prevention Tabs */}
        <div className="md:col-span-7 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-emerald-500/20 gap-2 mb-4">
            <button
              onClick={() => setActiveTab("prevention")}
              className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 transition-all relative ${
                activeTab === "prevention"
                  ? "text-emerald-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Prevention & Management</span>
              {activeTab === "prevention" && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("description")}
              className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 transition-all relative ${
                activeTab === "description"
                  ? "text-emerald-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pathology Description</span>
              {activeTab === "description" && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "prevention" ? (
              <motion.div
                key="prevention"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 flex-1"
              >
                <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                  {result.isHealthy
                    ? "Recommended Maintenance Guidelines"
                    : "Actionable Disease Control Steps"}
                </h4>

                <ul className="space-y-2.5">
                  {preventionPoints.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl glass-card text-xs sm:text-sm text-slate-200 leading-relaxed"
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
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 flex-1"
              >
                <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                  Clinical Diagnosis Overview
                </h4>

                <div className="space-y-2.5">
                  {descriptionPoints.map((desc, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl glass-card text-xs sm:text-sm text-slate-300 leading-relaxed"
                    >
                      {desc}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alternative Candidates */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="mt-6 pt-4 border-t border-emerald-500/15">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Secondary Probabilities
              </span>
              <div className="flex flex-wrap gap-2">
                {result.alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-1.5"
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
