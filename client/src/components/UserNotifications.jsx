import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const UserNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    // LocalStorageから既読通知IDを取得
    const getReadNotifications = () => {
        const read = localStorage.getItem('readNotifications');
        return read ? JSON.parse(read) : [];
    };

    // LocalStorageに既読通知IDを保存
    const saveReadNotification = (id) => {
        const readIds = getReadNotifications();
        if (!readIds.includes(id)) {
            readIds.push(id);
            localStorage.setItem('readNotifications', JSON.stringify(readIds));
        }
    };

    // 通知を読み込み
    useEffect(() => {
        loadNotifications();
        
        // 30秒ごとに通知を更新
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await fetch('/api/notifications/user');
            const data = await response.json();
            
            // 既読済みIDを取得
            const readIds = getReadNotifications();
            
            // 全ユーザー向け（target='all'）かつ未読の通知のみを表示、上位3件
            const unreadNotifications = data
                .filter(n => n.target === 'all' && !readIds.includes(n.id))
                .slice(0, 3);
            
            setNotifications(unreadNotifications);
        } catch (error) {
            console.error('通知の読み込みに失敗しました:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            // ローカルストレージに既読として保存
            saveReadNotification(id);
            
            // サーバー側の既読カウントを更新（オプション）
            await fetch(`/api/notifications/${id}/read`, {
                method: 'PATCH'
            });
            
            // UI から削除
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('通知の既読化に失敗しました:', error);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getPriorityGradient = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'from-pink-600 to-pink-500';
            case 'high':
                return 'from-pink-500 to-pink-400';
            case 'medium':
                return 'from-pink-400 to-pink-300';
            default:
                return 'from-pink-300 to-pink-200';
        }
    };

    if (isLoading) {
        return (
            <div className="mb-6 animate-pulse" data-testid="notifications-loading">
                <div className="h-20 bg-gradient-to-r from-pink-200 to-pink-100 rounded-xl"></div>
            </div>
        );
    }

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 space-y-3" data-testid="notifications-container">
            {notifications.map((notification, index) => (
                <div
                    key={notification.id}
                    className={`bg-gradient-to-r ${getPriorityGradient(notification.priority)} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 cursor-pointer`}
                    data-testid={`notification-${notification.id}`}
                    style={{
                        animation: `fadeSlideIn 0.5s ease-out ${index * 0.1}s backwards`
                    }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-white animate-pulse" data-testid="icon-bell" />
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <button
                                    onClick={() => toggleExpand(notification.id)}
                                    className="w-full text-left"
                                    data-testid={`button-expand-${notification.id}`}
                                >
                                    <h3 className="text-white font-semibold text-sm md:text-base mb-1" data-testid={`text-title-${notification.id}`}>
                                        {notification.title}
                                    </h3>
                                    <p 
                                        className={`text-white/90 text-xs md:text-sm ${
                                            expandedId === notification.id ? '' : 'line-clamp-2'
                                        }`}
                                        data-testid={`text-message-${notification.id}`}
                                    >
                                        {notification.message}
                                    </p>
                                    {notification.message.length > 100 && (
                                        <span className="text-white/70 text-xs mt-1 inline-block hover:text-white transition-colors">
                                            {expandedId === notification.id ? '折りたたむ' : '続きを読む'}
                                        </span>
                                    )}
                                </button>
                                
                                <div className="flex items-center gap-4 mt-2 text-white/70 text-xs">
                                    <span data-testid={`text-time-${notification.id}`}>
                                        {new Date(notification.createdAt).toLocaleString('ja-JP', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    {notification.priority === 'urgent' && (
                                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-white font-medium text-xs" data-testid="badge-urgent">
                                            緊急
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                            data-testid={`button-dismiss-${notification.id}`}
                            aria-label="通知を閉じる"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            ))}
            
            <style>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default UserNotifications;
