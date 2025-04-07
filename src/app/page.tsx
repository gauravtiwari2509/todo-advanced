"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaTasks, FaChartLine, FaRobot } from "react-icons/fa";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            TaskMaster Pro
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl">
            A powerful todo application with analytics, checkpoints, and AI
            assistance to help you manage your tasks efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Login
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-blue-400 text-3xl mb-4">
                <FaTasks />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-400">
                Create, organize, and track your tasks with checkpoints and
                priority levels.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-purple-400 text-3xl mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-400">
                Visualize your productivity with detailed analytics and
                insights.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-green-400 text-3xl mb-4">
                <FaRobot />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-gray-400">
                Get help with task management from our intelligent chatbot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
