"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface SampleLeavesProps {
  onSelectSample: (imageSrc: string, filename: string) => void;
  disabled?: boolean;
}

const SAMPLES = [
  {
    name: "Apple Black Rot",
    src: "/samples/apple_black_rot.jpg",
    crop: "Apple",
    status: "Diseased",
  },
  {
    name: "Corn Common Rust",
    src: "/samples/corn_common_rust.jpg",
    crop: "Corn",
    status: "Diseased",
  },
  {
    name: "Tomato Early Blight",
    src: "/samples/tomato_early_blight.jpg",
    crop: "Tomato",
    status: "Diseased",
  },
  {
    name: "Potato Late Blight",
    src: "/samples/potato_late_blight.jpg",
    crop: "Potato",
    status: "Diseased",
  },
  {
    name: "Tomato Healthy",
    src: "/samples/tomato_healthy.jpg",
    crop: "Tomato",
    status: "Healthy",
  },
  {
    name: "Apple Cedar Rust",
    src: "/samples/apple_cedar_rust.jpg",
    crop: "Apple",
    status: "Diseased",
  },
];

export default function SampleLeaves({ onSelectSample, disabled }: SampleLeavesProps) {
  return (
    <div className="mt-8 pt-6 border-t border-[#1a3821]">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Quick-Test Library (1-Click Sample Leaves)
          </h4>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Click any leaf to test diagnosis instantly
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
        {SAMPLES.map((sample) => (
          <motion.button
            key={sample.name}
            type="button"
            disabled={disabled}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectSample(sample.src, sample.name.toLowerCase().replace(/\s+/g, "_") + ".jpg")}
            className="group surface-card rounded-xl p-2 text-left disabled:opacity-50 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-black/50 mb-2 relative border border-[#1a3821]">
                <img
                  src={sample.src}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span
                  className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    sample.status === "Healthy"
                      ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-950/90 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {sample.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-100 truncate leading-tight">
                {sample.name}
              </p>
            </div>
            
            <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
              <span>{sample.crop}</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
