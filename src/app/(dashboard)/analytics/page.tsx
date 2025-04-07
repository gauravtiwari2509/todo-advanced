"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaCheckCircle, FaClock, FaList } from "react-icons/fa";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  totalTodos: number;
  completedTodos: number;
  completionRate: string;
  todosByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  todosByCategory: Record<string, number>;
  recentTodos: number;
  recentCompletedTodos: number;
  averageCompletionTimeHours: string;
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics");

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Prepare data for charts
  const priorityData = analyticsData
    ? {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            label: "Tasks by Priority",
            data: [
              analyticsData.todosByPriority.high,
              analyticsData.todosByPriority.medium,
              analyticsData.todosByPriority.low,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const categoryData = analyticsData
    ? {
        labels: Object.keys(analyticsData.todosByCategory),
        datasets: [
          {
            label: "Tasks by Category",
            data: Object.values(analyticsData.todosByCategory),
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const completionData = analyticsData
    ? {
        labels: ["Completed", "Pending"],
        datasets: [
          {
            label: "Task Completion",
            data: [
              analyticsData.completedTodos,
              analyticsData.totalTodos - analyticsData.completedTodos,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.7)",
              "rgba(255, 99, 132, 0.7)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Analytics Dashboard
          </h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Analytics Dashboard
          </h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Analytics Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Tasks</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {analyticsData?.totalTodos || 0}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaList className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Tasks</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {analyticsData?.completedTodos || 0}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completion Rate</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {analyticsData?.completionRate || "0"}%
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaCheckCircle className="text-purple-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg. Completion Time</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {analyticsData?.averageCompletionTimeHours || "0"} hrs
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaClock className="text-yellow-500 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Task Completion
            </h2>
            {completionData && (
              <div className="h-64 flex items-center justify-center">
                <Doughnut
                  data={completionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tasks by Priority
            </h2>
            {priorityData && (
              <div className="h-64">
                <Bar
                  data={priorityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 mb-2">Tasks Created (Last 7 Days)</p>
              <p className="text-2xl font-bold text-gray-800">
                {analyticsData?.recentTodos || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-2">
                Tasks Completed (Last 7 Days)
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {analyticsData?.recentCompletedTodos || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
