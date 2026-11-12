"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface CameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setError(null);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        setError("Unable to access camera: " + (err.message || "Permission denied"));
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode]);

  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `leaf_camera_${Date.now()}.jpg`, { type: "image/jpeg" });
      onCapture(file, dataUrl);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      onClose();
    }, "image/jpeg", 0.92);
  };

  const toggleFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative rounded-2xl overflow-hidden glass-panel border border-emerald-500/40 p-4 max-w-lg mx-auto"
    >
      <div className="flex items-center justify-between mb-3 text-slate-200">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">Align Leaf in Frame</span>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error ? (
        <div className="p-6 text-center text-rose-300 bg-rose-950/40 rounded-xl text-sm border border-rose-500/30">
          {error}
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {/* Framing Target Box */}
          <div className="absolute inset-8 border-2 border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-xs text-emerald-300/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur">
              Place single leaf here
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={toggleFacing}
          className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700"
          title="Switch Camera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleSnap}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/30"
        >
          <Camera className="w-5 h-5" />
          <span>Capture Photo</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
