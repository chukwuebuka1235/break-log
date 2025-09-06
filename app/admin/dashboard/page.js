'use client'
import { useRouter } from 'next/navigation';
import { useState , useEffect } from 'react'
export default function Page() {
    const [breaks, setBreaks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
    );
    const [isLoading, setIsLoading] = useState(false);
    const [totalBreaks, setTotalBreaks] = useState(0);
    const [ongoingBreaks, setOngoingBreaks] = useState(0);
    const router = useRouter();

    const fetchBreaks = async (date) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/breaks?date=${date}`);
        if (response.ok) {
          const data = await response.json();
          setBreaks(data);

          // Calculate statistics
          setTotalBreaks(data.length);
          setOngoingBreaks(
            data.filter((breakItem) => breakItem.breakEnd === null).length
          );
        }
      } catch (error) {
        console.error("Failed to fetch breaks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      fetchBreaks(selectedDate);
    }, [selectedDate]);
    const exportToCSV = () => {
      const csvContent = [
        [
          "Employee",
          "Start Time",
          "End Time",
          "Description",
          "Duration (minutes)",
        ],
        ...breaks.map((breakItem) => [
          breakItem.employeeName,
          new Date(breakItem.breakStart).toLocaleString("en-NG", {
            timeZone: "Africa/Lagos",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          breakItem.breakEnd
            ? new Date(breakItem.breakEnd).toLocaleString("en-NG", {
                timeZone: "Africa/Lagos",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "Ongoing",
          breakItem.description || "No description",
          breakItem.breakEnd
            ? Math.round(
                (new Date(breakItem.breakEnd) -
                  new Date(breakItem.breakStart)) /
                  60000
              )
            : "In progress",
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `breaks-${selectedDate}.csv`;
      a.click();
    };
    const formatDuration = (start, end) => {
      if (!end) return "In progress";
      const minutes = Math.round((new Date(end) - new Date(start)) / 60000);
      return `${minutes} minutes`;
    };

    return (
      <div className="bg-[#fef2f2] min-h-[calc(100vh-64px)]">
        {/* DASHBOARD CONTENT */}
        <div className="p-6 max-w-6xl mx-auto ">
          <h1 className="text-2xl mb-6 text-center">
            Break Management Dashboard
          </h1>

          {/* Date Selection and Stats */}
          <div className="bg-[#fef2f2] rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {totalBreaks}
                  </div>
                  <div className="text-sm text-blue-800">Total Breaks</div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {ongoingBreaks}
                  </div>
                  <div className="text-sm text-amber-800">Ongoing Breaks</div>
                </div>
              </div>

              <button
                onClick={exportToCSV}
                className="bg-[#ec3338] text-white px-4 py-2 rounded hover:bg-[#f03a40]">
                Export to Excel
              </button>
            </div>
          </div>

          {/* Breaks Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">Loading breaks data...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {breaks.map((breakItem) => (
                        <tr
                          key={breakItem.id}
                          className={breakItem.breakEnd ? "" : "bg-blue-50"}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {breakItem.employeeName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(breakItem.breakStart).toLocaleString(
                              "en-NG",
                              {
                                timeZone: "Africa/Lagos",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                // day: "2-digit",
                                // month: "short",
                                // year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {breakItem.breakEnd
                              ? new Date(breakItem.breakEnd).toLocaleString(
                                  "en-NG",
                                  {
                                    timeZone: "Africa/Lagos",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    // day: "2-digit",
                                    // month: "short",
                                    // year: "numeric",
                                  }
                                )
                              : "Ongoing"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {breakItem.description || "No description provided"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDuration(
                              breakItem.breakStart,
                              breakItem.breakEnd
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {breaks.length === 0 && !isLoading && (
                  <div className="p-8 text-center text-gray-500">
                    No break records found for {selectedDate}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
}