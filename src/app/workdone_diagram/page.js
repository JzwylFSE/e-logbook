"use client"
import { useState, useRef } from "react"
import { ReactSketchCanvas } from "react-sketch-canvas"
import { supabase } from "../../../utils/supabase/client"

export default function DrawingPad({ weekId, activityId, userId }) {
  const canvasRef = useRef(null)
  const [title, setTitle] = useState("")
  const [isErasing, setIsErasing] = useState(false)
  const [strokeColor, setStrokeColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState(4)

  const handleSave = async () => {
    const drawingData = await canvasRef.current.exportPaths()
    
    const { error } = await supabase.from("drawings").insert([{
      user_id: userId,
      week_id: weekId,
      activity_id: activityId,
      title,
      drawing_data: drawingData
    }])

    if (!error) {
      alert("Drawing saved successfully!")
      setTitle("")
      canvasRef.current.clearCanvas()
    }
  }

  const toggleEraser = () => {
    setIsErasing(!isErasing)
    setStrokeColor(isErasing ? "#000000" : "#FFFFFF") // White for eraser
    setStrokeWidth(isErasing ? 4 : 20) // Thicker for eraser
  }

  return (
    // still add description field
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={toggleEraser}
          className={`px-4 py-2 rounded ${isErasing ? "bg-red-500 text-white" : "bg-gray-200"}`}
        >
          {isErasing ? "Switch to Pen" : "Use Eraser"}
        </button>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Drawing title"
          className="flex-1 p-2 border rounded"
        />
        
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="500px"
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          eraserWidth={20} // Eraser size when using eraser tool
          withViewBox={true}
        />
      </div>
    </div>
  )
}