'use client'; // This directive marks the component as a Client Component

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas'; // Ensure 'react-signature-canvas' is installed via npm or yarn

/**
 * SignaturePad component for capturing user signatures.
 * @param {object} props - The component props.
 * @param {function(string | null): void} props.onSave - Callback function when the signature is saved.
 * Receives the signature data URL (image/png) or null if empty/error.
 * @param {string} props.label - The label to display above the signature pad.
 */
export default function SignaturePad({ onSave, label }) {
  // Create a ref to access the SignatureCanvas instance
  const sigPad = useRef(null);

  // State to track if the user is currently drawing on the canvas
  const [isDrawing, setIsDrawing] = useState(false);

  /**
   * Clears the signature canvas.
   */
  const handleClear = () => {
    if (sigPad.current) { // Ensure the ref is not null before accessing its methods
      sigPad.current.clear();
      console.log("Signature pad cleared.");
      // Optionally, if you're displaying a preview elsewhere, clear that too
      onSave(null); // Notify parent that signature is cleared
    }
  };

  /**
   * Saves the signature from the canvas as a data URL.
   * It trims the whitespace around the signature before converting to a data URL.
   */
  const handleSave = () => {
    if (sigPad.current) { // Ensure the ref is not null
      // Check if the canvas is empty before attempting to save
      if (sigPad.current.isEmpty()) {
        console.warn("Signature pad is empty. Nothing to save.");
        // Optionally, provide user feedback (e.g., a toast message "Please draw your signature.")
        onSave(null); // Pass null to indicate no signature was saved
        return;
      }

      // Get the trimmed canvas element. This creates a new canvas with only the drawn content.
      const trimmedCanvas = sigPad.current.getTrimmedCanvas();

      if (trimmedCanvas) { // Ensure trimmedCanvas is valid before getting data URL
        // Convert the trimmed canvas content to a PNG data URL
        const signatureDataUrl = trimmedCanvas.toDataURL("image/png");
        console.log("Signature saved. Data URL length:", signatureDataUrl.length);
        onSave(signatureDataUrl); // Pass the data URL to the parent component via onSave prop
      } else {
        console.error("Failed to get trimmed canvas from SignatureCanvas.");
        onSave(null); // Indicate failure to the parent
      }
    } else {
      console.error("Signature pad ref is not available when trying to save.");
      onSave(null); // Indicate failure to the parent
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm font-inter">
      {/* Label for the signature pad */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Container for the SignatureCanvas */}
      <div
        className="border-2 border-gray-300 rounded-md bg-gray-50 overflow-hidden"
        // onMouseDown and onMouseUp events are handled internally by SignatureCanvas
        // We removed them here to prevent conflicts and ensure explicit save
      >
        <SignatureCanvas
          ref={sigPad} // Attach the ref to the SignatureCanvas component
          penColor="black" // Color of the drawing pen
          // These classes apply to the wrapper div that SignatureCanvas creates
          className="w-full h-48"
          canvasProps={{
            width: 200, // Internal resolution width of the canvas element
            height: 200, // Internal resolution height of the canvas element
            style: { touchAction: 'none' } // Important for preventing scrolling on touch devices while drawing
          }}
          // Callbacks for when drawing begins and ends on the canvas
          onBegin={() => setIsDrawing(true)}
          onEnd={() => setIsDrawing(false)}
        />
      </div>

      {/* Control buttons and status message */}
      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md shadow-sm
                     hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75
                     transition duration-150 ease-in-out"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSave} // Explicit save button
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md shadow-sm
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                     transition duration-150 ease-in-out"
        >
          Save Signature
        </button>
      </div>

      {/* Drawing status indicator */}
      <div className="text-center mt-2 text-xs text-gray-500">
        {isDrawing ? "Drawing..." : "Draw your signature above."}
      </div>
    </div>
  );
}
