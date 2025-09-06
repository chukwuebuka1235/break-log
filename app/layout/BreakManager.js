"use client";
import { Users } from "../../data";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

export const BreakManager = ({ employeeName, setEmployeeName }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [showBreaksheet, setShowBreaksheet] = useState(false);
  const [userHasActiveBreak, setUserHasActiveBreak] = useState(false);

  const checkUserBreakStatus = async (name) => {
    if (!name) return;
    try {
      setIsLoading(true);
      const response = await fetch("/api/breaks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const allData = await response.json();
        setData(allData);

        //CHECK FOR ACTIVE BREAK
        const activeBreak = allData.find(
          (item) => item.employeeName === name && item.breakEnd === null
        );
        setUserHasActiveBreak(!!activeBreak);
      }
    } catch (error) {
      console.log("Failed to fetch breaks", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (employeeName) {
      checkUserBreakStatus(employeeName);
    }
  }, [employeeName]);

  const startBreak = async (name) => {
    if (!name) {
      alert("Please select your name first");
      return;
    }
    if (!description && description.trim() === "") {
      alert("Please enter a break description");
      return;
    }
    try {
      setIsLoading(true);
      setShowDescription(false);
      setDescription("");
      const response = await fetch("api/breaks", {
        method: "POST",
        body: JSON.stringify({
          employeeName: name,
          description: description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        toast.success(`Break started for ${name}`);
        setUserHasActiveBreak(true); 
        await checkUserBreakStatus(name); 
      } else {
      toast.error(`failed to start break for ${name}`);
        alert("Failed to start break. Please try again.");
      }
    } catch (error) {
      toast.error(`failed to start break for ${name}`);
      alert("Error starting break. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const endBreak = async (name) => {
    if (!name) {
      alert("Please select your name first");
      return;
    }
    try {
      setIsLoading(true);
      const activeBreak = data.find(
        (item) => item.employeeName === name && item.breakEnd === null
      );
      if (!activeBreak) {
        alert("No active break found for this user");
        return;
      }

      // Call the API to end the break
      const response = await fetch(`/api/breaks/${activeBreak.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(`Break ended for ${name}`);
        setUserHasActiveBreak(false);
        setEmployeeName("");
        await checkUserBreakStatus(name); // Refresh the data
      } else {
      toast.error(`failed to end break for ${name}`);
        alert("Failed to end break. Please try again.");
      }
    } catch (error) {
      toast.error(`failed to end break for ${name}`);
      alert("Error ending break. Please try again.");
    } finally {
      setIsLoading(false);
      setDescription("");
    }
  };
  const BreakLogs = async (name) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/breaks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const allData = await response.json();
        setData(allData);
      } else {
        console.log("failed to fetch breaks for", name);
      }
    } catch (error) {
      console.log("failed to fetch breaks", error);
    } finally {
      setIsLoading(false);
    }
  };
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
        case 1:
          return "ST";
        case 2:
          return "ND";
        case 3:
          return "RD";
        default:
          return "TH";
      }
    };
    return `${day}${getOrdinal(day)} ${month}, ${year}`;
  }
  const today = new Date();
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="flex flex-col gap-4 ">
        <h1 className="text-2xl ">
          BREAK TRACKER FOR {formatDate(today)}{" "}
        </h1>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent disabled:bg-gray-100"
          value={employeeName}
          onChange={(e) => {
            setEmployeeName(e.target.value), setShowDescription(true);
          }}
          disabled={isLoading}>
          <option value="" disabled>
            SELECT YOUR NAME
          </option>
          {Users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>

        {showDescription && !userHasActiveBreak && (
          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Break Description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent"
            />
          </div>
        )}

        {isLoading ? (
          <div className="bg-[#f8b4b4] text-white px-4 py-3 rounded-lg text-center">
            Loading...
          </div>
        ) : userHasActiveBreak ? (
          <button
            onClick={() => endBreak(employeeName)}
            className="bg-[#ec3338] text-white px-4 py-3 rounded-lg hover:bg-[#dc2626] transition-colors disabled:bg-[#f8b4b4] disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            disabled={isLoading}>
            END BREAK
          </button>
        ) : (
          <button
            onClick={() => startBreak(employeeName)}
            className="bg-[#ec3338] text-white px-4 py-3 rounded-lg hover:bg-[#dc2626] transition-colors disabled:bg-[#f8b4b4] disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            disabled={isLoading || !employeeName}>
            START BREAK
          </button>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">BREAKSHEET</h1>
          <div className="mb-6">
            <button
              onClick={() => {
                BreakLogs(employeeName), setShowBreaksheet(!showBreaksheet);
              }}
              className="bg-[#ec3338] text-white px-4 py-2 rounded-lg hover:bg-[#dc2626] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
              {showBreaksheet ? (
                <>
                  HIDE BREAK SHEET <ChevronUp size={20} />
                </>
              ) : (
                <>
                  SHOW BREAK SHEET <ChevronDown size={20} />
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          {showBreaksheet && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data
                    .filter((item) => {
                      const breakStartDate = new Date(item.breakStart);
                      const today = new Date();

                      // Check if break started today (same day, month, and year)
                      return (
                        breakStartDate.getDate() === today.getDate() &&
                        breakStartDate.getMonth() === today.getMonth() &&
                        breakStartDate.getFullYear() === today.getFullYear()
                      );
                    })
                    .map((item, index) => (
                      <tr
                        key={index}
                        className={item.breakEnd ? "" : "bg-blue-50"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.employeeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.breakStart).toLocaleString([], {
                            timeZone: "Africa/Lagos",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.breakEnd
                            ? new Date(item.breakEnd).toLocaleString([], {
                                timeZone: "Africa/Lagos",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "Ongoing"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.breakEnd
                            ? `${Math.round(
                                (new Date(item.breakEnd) -
                                  new Date(item.breakStart)) /
                                  60000
                              )} minutes`
                            : "In progress"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {data.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No break records found. Click the button to fetch breaks.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
