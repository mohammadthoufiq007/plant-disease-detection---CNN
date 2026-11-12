"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    <div className="mt-8 pt-6 border-t border-emerald-500/15">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <h4 className="text-sm font-semibold text-slate-200">
          Try a Sample Test Leaf (1-Click Test)
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {SAMPLES.map((sample, index) => (
          <motion.button
            key={sample.name}
            type="button"
            disabled={disabled}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectSample(sample.src, sample.name.toLowerCase().replace(/\s+/g, "_") + ".jpg")}
            className="group relative flex flex-col items-center p-2 rounded-xl glass-card transition-all text-left overflow-hidden disabled:opacity-50"
          >
            <div className="w-full h-20 rounded-lg overflow-hidden bg-slate-900/60 mb-2 relative">
              <img
                src={sample.src}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <span
                className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  sample.status === "Healthy"
                    ? "bg-emerald-500/80 text-white"
                    : "bg-amber-500/80 text-black"
                }`}
              >
                {sample.status}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-200 truncate w-full text-center">
              {sample.name}
            </span>
            <span className="text-[10px] text-emerald-400/80">{sample.crop}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
