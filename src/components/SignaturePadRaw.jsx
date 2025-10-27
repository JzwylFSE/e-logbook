'use client';

import { useRef, useEffect, useState } from 'react';

export default function SignaturePadRaw({ onSave, label }) {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize signature_pad
  useEffect(() => {
    const initSignaturePad = async () => {
      try {
        // Dynamically import to avoid SSR issues
        const SignaturePad = (await import('signature_pad')).default;
        
        if (canvasRef.current) {
          // --- NEW: make canvas high-DPI aware and styleable ---
          const canvas = canvasRef.current;
          const resizeCanvasForDPR = () => {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.round(rect.width * ratio);
            canvas.height = Math.round(rect.height * ratio);
            const ctx = canvas.getContext('2d');
            ctx.scale(ratio, ratio);
          };
          // initial resize
          resizeCanvasForDPR();
          // optional: resize on window resize
          window.addEventListener("resize", resizeCanvasForDPR);

          signaturePadRef.current = new SignaturePad(canvas, {
            minWidth: 1,
            maxWidth: 1,
            penColor: 'black',
            backgroundColor: 'rgb(255, 255, 255)',
          });

          // Set up event listeners
          signaturePadRef.current.addEventListener('beginStroke', () => {
            console.log("🖊️ Drawing started on:", label);
            setIsDrawing(true);
          });

          signaturePadRef.current.addEventListener('endStroke', () => {
            console.log("📝 Drawing ended on:", label);
            setIsDrawing(false);
          });

          // cleanup listener on unmount
          const cleanup = () => window.removeEventListener("resize", resizeCanvasForDPR);
          // store cleanup for useEffect return
          canvas.__sigpad_cleanup = cleanup;
        }
      } catch (error) {
        console.error('Error loading signature_pad:', error);
      }
    };

    initSignaturePad();

    return () => {
      // cleanup
      const canvas = canvasRef.current;
      if (canvas && canvas.__sigpad_cleanup) canvas.__sigpad_cleanup();
    };
  }, [label]);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      console.log("🧹 Signature cleared on:", label);
      onSave(null);
    }
  };

  const handleSave = () => {
    if (signaturePadRef.current) {
      if (signaturePadRef.current.isEmpty()) {
        console.log("⚠️ Cannot save - signature pad is empty on:", label);
        onSave(null);
        return;
      }

      const signatureDataUrl = signaturePadRef.current.toDataURL();
      console.log("✅ Signature saved successfully on:", label);
      onSave(signatureDataUrl);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="border-2 border-gray-300 rounded-md bg-white overflow-hidden">
        {/* MAIN EDITABLE CANVAS: change className to style visually */}
        <canvas
          ref={canvasRef}
          className="w-full h-48 rounded-md bg-white" 
          style={{ touchAction: 'none', display: 'block' }}
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Signature
        </button>
      </div>

      <div className="text-center mt-2 text-xs text-gray-500">
        {isDrawing ? "Drawing..." : "Draw your signature above."}
      </div>
    </div>
  );
}