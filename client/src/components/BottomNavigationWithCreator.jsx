import React from "react";
import { Home, BookOpen, Trophy, User, MessageCircle, Plus, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUnreadMessages } from "../context/UnreadMessagesContext";
import { useCreator } from "../context/CreatorContext";

const BottomNavigationWithCreator = ({ active = "Home" }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { unreadCount } = useUnreadMessages();
    const { canCreatePosts, canAccessDashboard } = useCreator();

    // 基本のナビゲーション項目（学生用）
    const baseItems = [
        { icon: Home, key: "home", label: "ホーム", onClick: () => navigate("/") },
        { icon: BookOpen, key: "feed", label: "コース", onClick: () => navigate("/feed") },
        { icon: Trophy, key: "ranking", label: "ランキング", onClick: () => navigate("/rankingpage") },
        { icon: MessageCircle, key: "messages", label: "メッセージ", onClick: () => navigate("/messages") },
        { icon: User, key: "account", label: "アカウント", onClick: () => navigate("/account") },
    ];

    // 講師用の追加項目
    const instructorItems = [
        { icon: Plus, key: "create", label: "コース作成", onClick: () => navigate("/create-post") },
        { icon: GraduationCap, key: "dashboard", label: "講師", onClick: () => navigate("/creator-dashboard") },
    ];

    // 講師が承認されている場合のみ追加項目を含める
    const items = canCreatePosts ? [...baseItems, ...instructorItems] : baseItems;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 z-50 shadow-lg">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-around py-3 px-2">
                    {items.map((item) => {
                        const isActive = active.toLowerCase() === item.key;
                        
                        return (
                            <motion.button
                                key={item.key}
                                onClick={item.onClick}
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-col items-center justify-center transition-all duration-200 relative min-w-[60px]"
                                data-testid={`nav-${item.key}`}
                            >
                                <motion.div 
                                    className="relative mb-1"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        className={`p-2 rounded-xl transition-all duration-300 ${
                                            isActive 
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                                                : "bg-transparent"
                                        }`}
                                        animate={isActive ? {
                                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                                        } : {}}
                                    >
                                        <item.icon 
                                            size={24} 
                                            strokeWidth={2.5} 
                                            className={`${
                                                isActive ? "text-white" : "text-gray-400"
                                            } transition-colors duration-200`}
                                        />
                                    </motion.div>
                                    
                                    {/* 未読メッセージバッジ */}
                                    {item.key === "messages" && unreadCount > 0 && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold border-2 border-white shadow-lg"
                                        >
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </motion.div>
                                    )}
                                    
                                    {/* 講師機能のバッジ */}
                                    {item.key === "create" && canCreatePosts && (
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"
                                        />
                                    )}
                                    {item.key === "dashboard" && canAccessDashboard && (
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                                        />
                                    )}
                                </motion.div>
                                
                                <span 
                                    className={`text-[10px] font-semibold text-center transition-colors duration-200 whitespace-nowrap ${
                                        isActive ? "text-blue-600" : "text-gray-500"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNavigationWithCreator;
