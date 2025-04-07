"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaTasks, FaChartBar, FaRobot, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return pathname === path ? "bg-blue-700" : "";
  };

  if (!session) {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="flex items-center">
                <FaTasks className="mr-2" />
                <span className="font-bold text-xl">TodoApp</span>
              </Link>
            </div>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/dashboard"
                )}`}
              >
                Dashboard
              </Link>
              <Link
                href="/analytics"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/analytics"
                )}`}
              >
                <div className="flex items-center">
                  <FaChartBar className="mr-1" />
                  Analytics
                </div>
              </Link>
              <Link
                href="/chatbot"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/chatbot"
                )}`}
              >
                <div className="flex items-center">
                  <FaRobot className="mr-1" />
                  AI Assistant
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              {session.user?.image ? (
                <img
                  className="h-8 w-8 rounded-full mr-2"
                  src={session.user.image}
                  alt={session.user.name || "User"}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center mr-2">
                  {session.user?.name
                    ? session.user.name[0].toUpperCase()
                    : "U"}
                </div>
              )}
              <span className="hidden md:block">{session.user?.name}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <div className="flex items-center">
                <FaSignOutAlt className="mr-1" />
                <span className="hidden md:block">Sign out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
