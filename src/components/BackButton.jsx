"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 mt-3 mb-3"
    >
      <ArrowLeft size={25} style={{ color: "#2b7fff" }}/>
    </button>
  )
}
