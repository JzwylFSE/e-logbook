"use client"
import { useState, useRef } from "react"
import { supabase } from "../../utils/supabase/client"
import { useRouter } from "next/navigation"
import { ReactSketchCanvas } from "react-sketch-canvas"

export default function WorkdoneDiagramForm({ weeks, userId, activities }) {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedWeek, setSelectedWeek] = useState(weeks?.[0]?.id || "")
  const [selectedActivity, setSelectedActivity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    setIsSubmitting(true)
    const drawingData = await canvasRef.current.exportPaths()
    
    const { error } = await supabase.from("workdone_diagram").insert([{
      user_id: userId,
      week_id: selectedWeek,
      activity_id: selectedActivity,
      title,
      description,
      drawing_data: drawingData
    }])

    setIsSubmitting(false)

    if (!error) {
      alert("Diagram saved successfully!")
      setTitle("")
      setDescription("")
      canvasRef.current.clearCanvas()
      router.refresh()
    }
  }

  // Filter activities based on selected week
  const filteredActivities = activities?.filter(
    activity => activity.week_id === selectedWeek
  ) || []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Week</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            {weeks?.map((week) => (
              <option key={week.id} value={week.id}>
                Week {week.week_number} ({new Date(week.start_date).toLocaleDateString('en-GB')})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Associated Activity</label>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Activity</option>
            {filteredActivities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.nature_of_activity} ({new Date(activity.activity_date).toLocaleDateString('en-GB')})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Diagram title"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 border rounded"
          placeholder="Detailed description of the diagram"
        />
      </div>

      <div className="border rounded-lg overflow-hidden mb-4">
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="500px"
          strokeWidth={4}
          strokeColor="black"
          withViewBox={true}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => canvasRef.current.clearCanvas()}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Drawing
        </button>
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {isSubmitting ? "Saving..." : "Save Diagram"}
        </button>
      </div>
    </div>
  )
}