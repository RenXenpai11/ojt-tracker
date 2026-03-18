import { Menu, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "../context/AuthContext";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1765648636207-22c892e8fae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHdvbWFuJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzgwNTI5NXww&ixlib=rb-4.1.0&q=80&w=1080";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [hasNotif] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user, profile } = useAuth();

  const isDark = theme === "dark";
  const displayName = user?.name || "OJT Trainee";
  const displaySubtext = user?.email || "OJT Trainee";
  const displayAvatar = profile?.avatarUrl || AVATAR_URL;

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 h-16 flex items-center justify-between shrink-0 shadow-sm dark:shadow-gray-950/50 z-10 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "13px" }}>
            Wednesday, March 18, 2026
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <button className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
          )}
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

        <button className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
          <div className="relative">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white dark:ring-gray-900" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-gray-800 dark:text-gray-100 leading-tight" style={{ fontSize: "13px", fontWeight: 600 }}>
              {displayName}
            </p>
            <p className="text-gray-400 dark:text-gray-500 leading-tight" style={{ fontSize: "11px" }}>
              {displaySubtext}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
