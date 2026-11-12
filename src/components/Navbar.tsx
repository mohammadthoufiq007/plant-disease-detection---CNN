"use client";

import React, { useState } from "react";
import { Leaf, Github, Key, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export default function Navbar({ apiKey, setApiKey }: NavbarProps) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSaveKey = () => {
    setApiKey(tempKey);
    setShowKeyModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#060d08]/90 border-b border-[#16311d] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Leaf className="w-5 h-5 fill-emerald-400/20 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  Plant Disease Detection CNN
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PyTorch CNN
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/80 hidden sm:block">
                Convolutional Neural Network • 39 Plant Disease Categories
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Optional API Key Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                apiKey
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                  : "btn-secondary text-slate-300"
              }`}
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>{apiKey ? "Gemini Key Active" : "Gemini API (Optional)"}</span>
              {apiKey && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/mohammadthoufiq007/plant-disease-detection---CNN"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg btn-secondary text-slate-300 hover:text-white"
              title="View Source on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="surface-panel w-full max-w-md p-6 rounded-2xl border border-emerald-500/30 shadow-2xl relative"
            >
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-white">Gemini Multimodal Vision</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                By default, this application classifies leaves against all 39 PlantVillage categories using the local CNN deep feature engine. You can optionally add a Google Gemini API key to enable secondary cross-verification.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-200 mb-1.5 block">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 bg-[#060d08] border border-[#20442a] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="flex justify-between items-center text-xs">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Get free API key from Google AI Studio →
                  </a>
                  {tempKey && (
                    <button
                      type="button"
                      onClick={() => setTempKey("")}
                      className="text-rose-400 hover:text-rose-300 underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="flex-1 py-2 text-sm rounded-lg btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="flex-1 py-2 text-sm rounded-lg btn-primary"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
