'use client'

import { useState, useRef } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import { supabase } from '@/lib/supabase/client'

export default function DrawingEditor({ weekId, activityId, user }) {
  const canvasRef = useRef(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSave = async () => {
    const drawingData = await canvasRef.current.exportPaths()
    
    const { error } = await supabase.from('drawings').insert([{
      user_id: user.id,
      week_id: weekId,
      activity_id: activityId,
      title,
      description,
      drawing_data: drawingData
    }])

    if (!error) {
      alert('Drawing saved successfully!')
      setTitle('')
      setDescription('')
      canvasRef.current.clearCanvas()
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="500px"
          strokeWidth={4}
          strokeColor="black"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Drawing
      </button>
    </div>
  )
}