import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  User,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/logs", label: "Logs", icon: ClipboardList, end: false },
  { to: "/profile", label: "Profile", icon: User, end: false },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function onLogout() {
    logout();
    onClose();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 z-30 flex flex-col
          shadow-xl dark:shadow-gray-950/80 border-r border-gray-100 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none lg:z-auto
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white leading-tight" style={{ fontSize: "15px", fontWeight: 700 }}>
                OJT Tracker
              </p>
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "11px" }}>
                Training Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p
            className="text-gray-400 dark:text-gray-600 px-3 mb-3"
            style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            Main Menu
          </p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
                ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                    ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: isActive ? 600 : 500 }}>{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150 w-full group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-950 flex items-center justify-center transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
