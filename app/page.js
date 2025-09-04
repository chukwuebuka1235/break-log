"use client";
import { useState , useEffect } from "react";
import { UserSelect } from "./layout/UserSelect";

export default function Home() {
  const [employeeName, setEmployeeName] = useState("");

  function formatDate(date) {
    const day = date.getDate();
    const month = date
      .toLocaleString("en-US", { month: "long", timeZone: "Africa/Lagos" })
      .toUpperCase();
    const year = date.getFullYear();

    // Function to add "st", "nd", "rd", "th"
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return "TH"; 
      switch (n % 10) {
        case 1: return "ST";
        case 2: return "ND";
        case 3: return "RD";
        default: return "TH";
      }
    };
    return `${day}${getOrdinal(day)} ${month}, ${year}`;
  }
  const today = new Date();
  // console.log(today);

  return (
    <div className="font-sans min-h-[calc(100vh-64px)] bg-[#fef2f2]">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold">
          BREAK TRACKER FOR {formatDate(today)}{" "}
        </h1>
        <UserSelect
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
        />
      </div>
    </div>
  );
}
