"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "../../utils/supabase/client";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function WorkdoneDiagramForm({ weeks, userId, activities, onDiagramSaved }) {
  const canvasRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredActivities, setFilteredActivities] = useState([]);

  // Drawing controls
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraser, setEraser] = useState(false);

  useEffect(() => {
    if (weeks?.length > 0 && !selectedWeek) {
      setSelectedWeek(weeks[0].id);
    }
  }, [weeks]);

  useEffect(() => {
    if (selectedWeek && activities) {
      const filtered = activities.filter(
        (activity) => activity.week_id?.toString() === selectedWeek.toString()
      );
      setFilteredActivities(filtered);
      setSelectedActivity("");
    }
  }, [selectedWeek, activities]);

  const handleSave = async () => {
    if (!title || !selectedWeek || !selectedActivity) {
      alert("Please select a week, activity, and provide a title");
      return;
    }

    setIsSubmitting(true);
    try {
      const drawingData = await canvasRef.current.exportPaths();
      if (!drawingData.length) throw new Error("Please create a drawing first");

      const insertData = {
        user_id: userId,
        week_id: selectedWeek,
        activity_id: selectedActivity,
        title,
        description,
        drawing_data: drawingData,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("drawings")
        .insert([insertData])
        .select();

      if (error) throw error;

      if (data?.[0] && onDiagramSaved) {
        onDiagramSaved(data[0]);
      }

      // Reset
      setTitle("");
      setDescription("");
      setSelectedActivity("");
      canvasRef.current.clearCanvas();
    } catch (error) {
      alert(`Failed to save diagram: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Week Selection */}
      <select
        value={selectedWeek}
        onChange={(e) => setSelectedWeek(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {weeks?.map((week) => (
          <option key={week.id} value={week.id}>
            Week {week.week_number} ({new Date(week.start_date).toLocaleDateString("en-GB")})
          </option>
        ))}
      </select>

      {/* Activity Selection */}
      <select
        value={selectedActivity}
        onChange={(e) => setSelectedActivity(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Activity</option>
        {filteredActivities.map((activity) => (
          <option key={activity.id} value={activity.id}>
            {activity.nature_of_activity} ({new Date(activity.activity_date).toLocaleDateString("en-GB")})
          </option>
        ))}
      </select>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Diagram title"
        className="w-full p-2 border rounded"
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full p-2 border rounded"
        placeholder="Optional description"
      />

      {/* Drawing Controls */}
      <div className="flex gap-3 flex-wrap">
        <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
        <input
          type="number"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
        />
        <button onClick={() => setEraser(!eraser)}>{eraser ? "Eraser" : "Draw"}</button>
        <button onClick={() => canvasRef.current?.undo()}>Undo</button>
        <button onClick={() => canvasRef.current?.redo()}>Redo</button>
        <button onClick={() => canvasRef.current?.clearCanvas()}>Clear</button>
      </div>

      {/* Canvas */}
      <ReactSketchCanvas
        ref={canvasRef}
        width="100%"
        height="400px"
        strokeWidth={strokeWidth}
        strokeColor={strokeColor}
        eraserWidth={strokeWidth}
        withViewBox
        eraserMode={eraser}
      />

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isSubmitting ? "Saving..." : "Save Diagram"}
      </button>
    </div>
  );
}
