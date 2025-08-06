"use client";

import { format } from "date-fns";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../utils/supabase/client";
import DeleteConfirmation from "@/components/DeleteConfirmation";

export default function WorkdoneDiagramList({ diagrams, activities, weeks, onDiagramDeleted }) {
  const canvasRefs = useRef({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load existing diagrams into their canvases
  useEffect(() => {
    diagrams.forEach((diagram) => {
      const canvas = canvasRefs.current[diagram.id];
      if (canvas) {
        const drawingData =
          typeof diagram.drawing_data === "string"
            ? JSON.parse(diagram.drawing_data)
            : diagram.drawing_data || [];
        canvas.loadPaths(drawingData);
      }
    });
  }, [diagrams]);

  // Delete a diagram from Supabase and memory
  const handleDelete = async (id) => {
    const { error } = await supabase.from("drawings").delete().eq("id", id);
    if (!error) {
      // Remove from parent state
      if (onDiagramDeleted) {
        onDiagramDeleted(id);
      }
      // Clean up canvas reference to free memory
      delete canvasRefs.current[id];
    }
    setDeleteTarget(null);
  };

  if (!diagrams.length) {
    return <div className="bg-gray-100 p-4 rounded-lg text-center">No diagrams yet</div>;
  }

  return (
    <div className="mt-8 space-y-6">
      {diagrams.map((diagram) => (
        <div key={diagram.id} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-bold">{diagram.title || "Untitled Diagram"}</h2>
              <p className="text-sm text-gray-500">
                Week {weeks.find((w) => w.id === diagram.week_id)?.week_number || "—"} •{" "}
                {activities.find((a) => a.id === diagram.activity_id)?.nature_of_activity || "—"}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {format(new Date(diagram.created_at), "MMM dd, yyyy")}
            </span>
          </div>

          {/* Read-only canvas */}
          <div className="mt-4 border rounded-lg overflow-hidden">
            <ReactSketchCanvas
              ref={(el) => (canvasRefs.current[diagram.id] = el)}
              width="100%"
              height="300px"
              strokeWidth={4}
              strokeColor="black"
              withViewBox
              readOnly
              style={{ backgroundColor: "white", pointerEvents: "none" }}
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex justify-end gap-2">
            <button
              className="px-3 py-1 text-red-500 hover:text-red-700"
              onClick={() => setDeleteTarget(diagram.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={!!deleteTarget}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
