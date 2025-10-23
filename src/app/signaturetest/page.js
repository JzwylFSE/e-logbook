"use client";

import { useState } from "react";
import SignaturePadRaw from "@/components/SignaturePadRaw";

export default function SignatureTest() {
  const [studentSig, setStudentSig] = useState(null);
  const [supervisorSig, setSupervisorSig] = useState(null);

  const handleStudentSave = (signature) => {
    console.log("🎯 Student Signature Saved:");
    console.log("Signature data URL length:", signature?.length || 0);
    console.log("Signature preview:", signature?.substring(0, 100));
    setStudentSig(signature);
  };

  const handleSupervisorSave = (signature) => {
    console.log("🎯 Supervisor Signature Saved:");
    console.log("Signature data URL length:", signature?.length || 0);
    console.log("Signature preview:", signature?.substring(0, 100));
    setSupervisorSig(signature);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">SignaturePadRaw Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SignaturePadRaw 
          label="Student Signature" 
          onSave={handleStudentSave} 
        />

        <SignaturePadRaw
          label="Supervisor Signature"
          onSave={handleSupervisorSave}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Status:</h2>
        <p>Student: {studentSig ? "✅ Signed" : "❌ Not signed"}</p>
        <p>Supervisor: {supervisorSig ? "✅ Signed" : "❌ Not signed"}</p>
      </div>
    </div>
  );
}