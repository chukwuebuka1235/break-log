"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import Toast from "../components/Toast";

export const BreakManager = ({ employeeName, setEmployeeName }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [showBreaksheet, setShowBreaksheet] = useState(false);
  const [userHasActiveBreak, setUserHasActiveBreak] = useState(false);

  // Get the authenticated user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setEmployeeName(user.name);

      checkUserBreakStatus(user.name);
    }
  }, [setEmployeeName]);

  const adjustToLagosTime = (date) => {
    return new Date(date.toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
  };

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

  const startBreak = async (name) => {
    if (!name) {
      toast.error("Please login first");
      return;
    }
    if (!description || description.trim() === "") {
      toast.error("Please enter a break description");
      return;
    }
    const firstname = name.split(" ")[0];
    try {
      setIsLoading(true);
      setShowDescription(false);
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
        toast.success(`Break started for ${firstname}`);
        setUserHasActiveBreak(true);
        setDescription("");
        await checkUserBreakStatus(name);
      } else {
        toast.error(`Failed to start break for ${firstname}`);
      }
    } catch (error) {
      toast.error(`Failed to start break for ${firstname}`);
    } finally {
      setIsLoading(false);
    }
  };

  const endBreak = async (name) => {
    if (!name) {
      toast.error("Please login first");
      return;
    }
    try {
      setIsLoading(true);
      const activeBreak = data.find(
        (item) => item.employeeName === name && item.breakEnd === null
      );
      const firstname = name.split(" ")[0];
      if (!activeBreak) {
        toast.error("No active break found for this user");
        return;
      }

      // END BREAK API
      const response = await fetch(`/api/breaks/${activeBreak._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(`Break ended for ${firstname}`);
        setUserHasActiveBreak(false);
        await checkUserBreakStatus(name);
      } else {
        toast.error(`Failed to end break for ${firstname}`);
      }
    } catch (error) {
      toast.error(`Failed to end break for ${firstname}`);
    } finally {
      setIsLoading(false);
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
    <>
      <div>
        {/* Controls Section */}
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto text-center">
          <h1 className="sm:text-xl">BREAK TRACKER FOR {formatDate(today)}</h1>
          {!userHasActiveBreak && (
            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Break Description (required)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent"
                required
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
              className="bg-[#ec3338] text-white px-4 py-3 rounded-lg hover:bg-[#dc2626] transition-colors disabled:bg-[#f8b4b4] disabled:cursor-not-allowed shadow-md hover:shadow-lg w-full max-w-xs mx-auto"
              disabled={isLoading}>
              END BREAK
            </button>
          ) : (
            <button
              onClick={() => startBreak(employeeName)}
              className="bg-[#ec3338] text-white px-4 py-3 rounded-lg hover:bg-[#dc2626] transition-colors disabled:bg-[#f8b4b4] disabled:cursor-not-allowed shadow-md hover:shadow-lg w-full max-w-xs mx-auto"
              disabled={isLoading || !employeeName || !description.trim()}>
              START BREAK
            </button>
          )}
        </div>
      </div>
      <div>
        {/* Breaksheet Section */}
        <div className="mt-8 w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-center flex-col">
            <h1 className="sm:text-1xl mb-4">BREAKSHEET</h1>
            <div className="mb-6">
              <button
                onClick={() => {
                  BreakLogs(employeeName);
                  setShowBreaksheet(!showBreaksheet);
                }}
                className="bg-[#ec3338] text-white px-4 py-2 rounded-lg hover:bg-[#dc2626] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg w-full max-w-xs mx-auto">
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
              <div className="w-full overflow-x-auto">
                <table className="min-w-[200px] w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Employee
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Start Time
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        End Time
                      </th>
                      <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Description
                      </th>
                      <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(() => {
                      const filteredData = data.filter((item) => {
                        const breakStartDate = adjustToLagosTime(
                          new Date(item.breakStart)
                        );
                        const today = adjustToLagosTime(new Date());
                        return (
                          breakStartDate.getDate() === today.getDate() &&
                          breakStartDate.getMonth() === today.getMonth() &&
                          breakStartDate.getFullYear() === today.getFullYear()
                        );
                      });
                      return filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                          <tr
                            key={index}
                            className={item.breakEnd ? "" : "bg-blue-50"}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 break-words truncate max-w-[120px] sm:max-w-none">
                              {(item.employeeName).split(" ")[0]}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(item.breakStart).toLocaleString([], {
                                timeZone: "Africa/Lagos",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.breakEnd
                                ? new Date(item.breakEnd).toLocaleString([], {
                                    timeZone: "Africa/Lagos",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : "Ongoing"}
                            </td>
                            <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-500 break-words max-w-[120px] sm:max-w-none">
                              {item.description}
                            </td>
                            <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.breakEnd
                                ? `${Math.round(
                                    (new Date(item.breakEnd) -
                                      new Date(item.breakStart)) /
                                      60000
                                  )} minutes`
                                : "In progress"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-gray-500">
                            No break records found.
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
