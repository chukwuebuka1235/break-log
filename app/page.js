"use client";
import { useState , useEffect } from "react";
import { BreakManager } from "./layout/BreakManager";

export default function Home() {
  const [employeeName, setEmployeeName] = useState("");

  return (
    <div className="font-sans bg-[#fef2f2]">
      <div className="flex flex-col items-center justify-center gap-4">
        <BreakManager
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
        />
      </div>
    </div>
  );
}
