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
      <header className="sticky top-0 z-50 glass-panel border-b border-emerald-500/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.08 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white"
            >
              <Leaf className="w-5 h-5 fill-current" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-300 via-green-200 to-white bg-clip-text text-transparent">
                  Plant Disease Detection CNN
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  AI v2.0
                </span>
              </div>
              <p className="text-xs text-emerald-400/70 hidden sm:block">
                Deep Learning Diagnostics • 39 Plant Categories
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Optional API Key Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                apiKey
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-emerald-500/30"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{apiKey ? "Gemini Key Configured" : "Add Gemini Key (Optional)"}</span>
              {apiKey && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </motion.button>

            {/* GitHub Link */}
            <a
              href="https://github.com/mohammadthoufiq007/plant-disease-detection---CNN"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500/30 text-slate-300 hover:text-white transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel w-full max-w-md p-6 rounded-2xl border border-emerald-500/30 shadow-2xl relative"
            >
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-white">Gemini Vision AI (Optional)</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                By default, this app uses our built-in 39-category PlantVillage CNN engine. You can optionally connect a free Google Gemini API key to activate multimodal vision verification.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">Google Gemini API Key</label>
                  <input
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-500/30 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    Get free API Key →
                  </a>
                  {tempKey && (
                    <button
                      type="button"
                      onClick={() => setTempKey("")}
                      className="text-red-400 hover:underline"
                    >
                      Clear key
                    </button>
                  )}
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="flex-1 py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="flex-1 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
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
