import { NavLink } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3, 
  DollarSign, 
  Shield, 
  LogOut, 
  Mail, 
  Bell, 
  Star, 
  Image, 
  Coins, 
  User,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

export default function Sidebar({ open, setOpen, onLogout }) {
  const { currentUser } = useAuth();

  const navItems = [
    { name: 'ダッシュボード', path: "/admin", icon: BarChart3 },
    { name: '学生管理', path: "/admin/users", icon: Users },
    { name: '講師管理', path: "/admin/creators", icon: GraduationCap },
    { name: 'コース管理', path: "/admin/posts", icon: BookOpen },
    { name: 'レポート管理', path: "/admin/reports", icon: FileText },
    { name: '注目コース管理', path: "/admin/featured-pickup", icon: Star },
    { name: 'スライダー管理', path: "/admin/home-slider", icon: Image },
    { name: '振込申請管理', path: "/admin/transfer-requests", icon: Coins },
    { name: '売上管理', path: "/admin/sales", icon: DollarSign },
    { name: '本人確認管理', path: "/admin/verification", icon: Shield },
    { name: 'メール通知', path: "/admin/email-notifications", icon: Mail },
    { name: 'プッシュ通知', path: "/admin/push-notifications", icon: Bell },
  ];

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-white border-r border-blue-100 shadow-lg transform md:translate-x-0 transition-transform duration-300 ease-in-out md:relative
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center space-x-2">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || '管理者'}
                  className="w-10 h-10 rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-800">{currentUser?.displayName || '管理者'}</h2>
                <p className="text-xs text-gray-500">SIN JAPAN 管理システム</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-medium">{name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mb-4"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">ログアウト</span>
            </button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">© 2025 SIN JAPAN ONLINE SCHOOL</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
