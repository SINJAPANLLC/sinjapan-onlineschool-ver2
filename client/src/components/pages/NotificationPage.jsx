import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ChevronRight,
    Info,
    Settings,
    Bell,
    CreditCard,
    Shield,
    AlertCircle,
    CheckCircle,
    Clock,
    Gift,
    Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const NotificationPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    // Different notification content for each page
    const notificationPages = [
        {
            id: 'security-update',
            title: 'Security & Privacy Update',
            notices: [
                {
                    id: 1,
                    title: "セキュリティ機能強化のお知らせ",
                    icon: Shield
                },
                {
                    id: 2,
                    title: "プライバシーポリシー更新について",
                    icon: AlertCircle
                }
            ],
            content: {
                greeting: "セキュリティ強化に関する重要なお知らせです。",
                mainContent: [
                    "アカウントのセキュリティをさらに強化するため、新機能を追加いたしました。",
                    "二段階認証の設定を強く推奨いたします。設定方法については、設定画面からご確認ください。",
                    "不正アクセスを防ぐため、定期的なパスワード変更をお願いいたします。",
                    "プライバシーポリシーを一部改定いたしました。主な変更点は以下の通りです：",
                    "・個人情報の取り扱いに関する記載を明確化",
                    "・第三者提供に関する規定を追加",
                    "・データ保存期間を明記",
                    "改定されたプライバシーポリシーは、サービス継続利用により同意したものとみなされます。",
                    "ご不明な点がございましたら、サポートまでお問い合わせください。",
                    "今後ともサービスをよろしくお願いいたします。"
                ],
                footer: "OnlyU運営チーム"
            }
        },
        {
            id: 'new-features',
            title: 'New Features & Updates',
            notices: [
                {
                    id: 1,
                    title: "新機能リリースのお知らせ",
                    icon: Star
                },
                {
                    id: 2,
                    title: "アプリバージョンアップ情報",
                    icon: Settings
                }
            ],
            content: {
                greeting: "新機能のリリースをお知らせいたします。",
                mainContent: [
                    "この度、ユーザーの皆様により良いサービスをご提供するため、以下の新機能を追加いたしました：",
                    "",
                    "【新機能】",
                    "・ダークモード対応",
                    "・通知設定の細分化",
                    "・プロフィール画像の複数枚アップロード",
                    "・投稿の下書き保存機能",
                    "・検索機能の強化",
                    "",
                    "【改善点】",
                    "・アプリの動作速度を向上",
                    "・バッテリー消費量を最適化",
                    "・UI/UXの改善",
                    "",
                    "これらの機能により、より快適にサービスをご利用いただけます。",
                    "アプリストアから最新版へのアップデートをお願いいたします。"
                ],
                footer: "OnlyU開発チーム"
            }
        },
        {
            id: 'system-maintenance',
            title: 'System Maintenance',
            notices: [
                {
                    id: 1,
                    title: "定期メンテナンスのお知らせ",
                    icon: Settings
                },
                {
                    id: 2,
                    title: "サーバー移行作業について",
                    icon: AlertCircle
                }
            ],
            content: {
                greeting: "システムメンテナンスの実施についてお知らせいたします。",
                mainContent: [
                    "サービス品質向上のため、以下の日程でメンテナンスを実施いたします。",
                    "",
                    "【メンテナンス日程】",
                    "日時: 2024年2月15日（木） 2:00 - 6:00",
                    "対象: 全サービス",
                    "",
                    "【影響範囲】",
                    "・アプリの利用が一時的にできなくなります",
                    "・メッセージの送受信ができなくなります",
                    "・投稿の閲覧・作成ができなくなります",
                    "",
                    "【注意事項】",
                    "・メンテナンス中はアプリにアクセスできません",
                    "・作業完了後、自動的にサービスが再開されます",
                    "・作業時間は前後する可能性があります",
                    "",
                    "ご不便をおかけいたしますが、ご理解のほどよろしくお願いいたします。"
                ],
                footer: "OnlyUシステム管理チーム"
            }
        }
    ];

    const currentNotification = notificationPages[currentPage];

    const nextPage = () => {
        if (currentPage < notificationPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 flex items-center z-10 shadow-sm">
                <motion.button 
                    onClick={() => navigate(-1)} 
                    className="text-blue-600 mr-4 p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-rose-50 rounded-full transition-all"
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowLeft size={24} strokeWidth={2.5} />
                </motion.button>
                <div className="flex items-center flex-1">
                    <motion.div
                        animate={{ 
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Bell className="w-6 h-6 text-blue-500 mr-2" strokeWidth={2.5} />
                    </motion.div>
                    <motion.h1 
                        className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        お知らせ
                    </motion.h1>
                </div>
                <motion.div 
                    className="text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {currentPage + 1} / {notificationPages.length}
                </motion.div>
            </div>

            <div className="p-4">
                {/* お知らせ一覧 */}
                <div className="mb-6">
                    <motion.h2 
                        className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        お知らせ一覧
                    </motion.h2>
                    <div className="space-y-3">
                        {notificationPages.map((page, index) => (
                            <motion.div
                                key={page.id}
                                onClick={() => setCurrentPage(index)}
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all shadow-sm ${
                                    currentPage === index 
                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-rose-50' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <motion.div 
                                            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                                                currentPage === index 
                                                    ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                                                    : 'bg-gray-100'
                                            }`}
                                            animate={currentPage === index ? {
                                                rotate: [0, -5, 5, -5, 0],
                                                scale: [1, 1.05, 1]
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {React.createElement(page.notices[0].icon, { 
                                                className: `w-5 h-5 ${currentPage === index ? 'text-white' : 'text-gray-600'}`,
                                                strokeWidth: 2.5
                                            })}
                                        </motion.div>
                                        <div>
                                            <h3 className={`font-bold ${
                                                currentPage === index 
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent' 
                                                    : 'text-gray-900'
                                            }`}>
                                                {page.title}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-600">
                                                {page.notices.length}件のお知らせ
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ChevronRight className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 現在のお知らせ詳細 */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentPage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-lg"
                    >
                        <div className="mb-6">
                            <motion.h2 
                                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {currentNotification.title}
                            </motion.h2>
                            <div className="flex flex-wrap gap-2">
                                {currentNotification.notices.map((notice, idx) => (
                                    <motion.div 
                                        key={notice.id} 
                                        className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-br from-blue-50 to-rose-50 border border-blue-200 rounded-full shadow-sm"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {React.createElement(notice.icon, { className: "w-4 h-4 text-blue-600", strokeWidth: 2.5 })}
                                        <span className="text-sm font-medium text-blue-700">{notice.title}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <motion.div 
                            className="prose prose-sm max-w-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <p className="text-gray-800 mb-4 font-bold">
                                {currentNotification.content.greeting}
                            </p>
                            
                            <div className="space-y-2">
                                {currentNotification.content.mainContent.map((line, index) => (
                                    <motion.p 
                                        key={index} 
                                        className={`text-gray-700 ${
                                            line.startsWith('【') || line.startsWith('・') 
                                                ? 'font-bold text-blue-700' 
                                                : line === '' 
                                                    ? 'h-4' 
                                                    : 'font-medium'
                                        }`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.03 }}
                                    >
                                        {line}
                                    </motion.p>
                                ))}
                            </div>

                            <motion.div 
                                className="mt-6 pt-4 border-t-2 border-blue-200"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent text-right">
                                    {currentNotification.content.footer}
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* ページネーション */}
                <div className="flex justify-between items-center mt-6">
                    <motion.button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="px-5 py-2.5 bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                        whileHover={currentPage !== 0 ? { scale: 1.05 } : {}}
                        whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
                    >
                        前へ
                    </motion.button>
                    
                    <div className="flex space-x-2">
                        {notificationPages.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                className={`rounded-full transition-all ${
                                    currentPage === index 
                                        ? 'w-8 h-3 bg-gradient-to-r from-blue-400 to-blue-600 shadow-md' 
                                        : 'w-3 h-3 bg-gray-300'
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                animate={currentPage === index ? {
                                    scale: [1, 1.1, 1]
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        ))}
                    </div>
                    
                    <motion.button
                        onClick={nextPage}
                        disabled={currentPage === notificationPages.length - 1}
                        className="px-5 py-2.5 bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                        whileHover={currentPage !== notificationPages.length - 1 ? { scale: 1.05 } : {}}
                        whileTap={currentPage !== notificationPages.length - 1 ? { scale: 0.95 } : {}}
                    >
                        次へ
                    </motion.button>
                </div>
            </div>

            <BottomNavigationWithCreator active="account" />
        </div>
    );
};

export default NotificationPage;
