import React, { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

export default function Topbar({ setSidebarOpen, onLogout }) {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-blue-100 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Left: Mobile menu button */}
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
            data-testid="button-toggle-sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            {t('AdminPage.topTitle')}
          </h1>
        </div>

        {/* Right: User menu */}
        <div className="flex items-center space-x-3">
          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              data-testid="button-user-menu"
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || '管理者'}
                  className="w-8 h-8 rounded-full object-cover shadow-md"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium">{currentUser?.displayName || '管理者'}</span>
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-blue-100"
                  >
                    <div className="px-4 py-3 border-b border-blue-100">
                      <p className="text-sm font-medium text-gray-900">管理者アカウント</p>
                      <p className="text-xs text-gray-500 mt-1">info@sinjapan.jp</p>
                    </div>

                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                      data-testid="button-logout-dropdown"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <span className="font-medium">ログアウト</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
