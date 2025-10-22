import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Send, 
  Eye, 
  Trash2, 
  Plus,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Download,
  RefreshCw,
  Search
} from 'lucide-react';
import { 
  AdminPageContainer, 
  AdminPageHeader, 
  AdminStatsCard, 
  AdminContentCard, 
  AdminLoadingState 
} from './AdminPageContainer';

const AnimatedNumber = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setDisplayValue(Math.floor(value * progress));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    pending: 0,
    failed: 0
  });

  const notificationStatuses = [
    { value: 'all', label: 'すべて' },
    { value: 'sent', label: '送信済み' },
    { value: 'pending', label: '送信待ち' },
    { value: 'failed', label: '送信失敗' }
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    let filtered = [...notifications];

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(notification => notification.status === filterStatus);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, filterStatus]);

  useEffect(() => {
    const newStats = {
      total: notifications.length,
      sent: notifications.filter(n => n.status === 'sent').length,
      pending: notifications.filter(n => n.status === 'pending').length,
      failed: notifications.filter(n => n.status === 'failed').length
    };
    setStats(newStats);
  }, [notifications]);

  const loadNotifications = () => {
    const mockNotifications = [
      {
        id: 'NOTIF_001',
        title: '新機能リリースのお知らせ',
        message: '動画再生速度調整機能がリリースされました！',
        type: 'system',
        status: 'sent',
        priority: 'high',
        target: 'all',
        recipients: 125430,
        createdAt: new Date('2025-01-10T10:00:00'),
        sentAt: new Date('2025-01-10T10:05:00')
      },
      {
        id: 'NOTIF_002',
        title: 'メンテナンスのお知らせ',
        message: '1月15日午前2時〜4時にメンテナンスを実施します。',
        type: 'system',
        status: 'pending',
        priority: 'urgent',
        target: 'all',
        recipients: 125430,
        createdAt: new Date('2025-01-09T15:00:00'),
        sentAt: null
      },
      {
        id: 'NOTIF_003',
        title: 'キャンペーンのご案内',
        message: '期間限定！新規登録で1ヶ月無料キャンペーン実施中！',
        type: 'marketing',
        status: 'sent',
        priority: 'medium',
        target: 'new_users',
        recipients: 5620,
        createdAt: new Date('2025-01-08T09:00:00'),
        sentAt: new Date('2025-01-08T09:15:00')
      }
    ];
    setNotifications(mockNotifications);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <AdminLoadingState message="通知データを読み込み中..." />;
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="通知管理"
        description="プッシュ通知とメール通知を管理します"
        icon={Bell}
        actions={
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="font-medium">更新</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl text-white hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
              data-testid="button-create-notification"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">通知作成</span>
            </motion.button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title="総通知数"
          value={<AnimatedNumber value={stats.total} />}
          icon={Bell}
          color="blue"
        />
        <AdminStatsCard
          title="送信済み"
          value={<AnimatedNumber value={stats.sent} />}
          icon={CheckCircle}
          color="green"
        />
        <AdminStatsCard
          title="送信待ち"
          value={<AnimatedNumber value={stats.pending} />}
          icon={Clock}
          color="yellow"
        />
        <AdminStatsCard
          title="送信失敗"
          value={<AnimatedNumber value={stats.failed} />}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <AdminContentCard title="検索とフィルター">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="通知を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              data-testid="input-search"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            data-testid="select-status"
          >
            {notificationStatuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </AdminContentCard>

      <div className="space-y-4">
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AdminContentCard>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Bell className="w-5 h-5 text-pink-500" />
                      <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.status)}`}>
                        {notification.status === 'sent' ? '送信済み' : notification.status === 'pending' ? '送信待ち' : '送信失敗'}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'urgent' ? '緊急' : notification.priority === 'high' ? '高' : notification.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{notification.recipients.toLocaleString()} 人</span>
                      </div>
                      <span>•</span>
                      <span>作成: {notification.createdAt.toLocaleString('ja-JP')}</span>
                      {notification.sentAt && (
                        <>
                          <span>•</span>
                          <span>送信: {notification.sentAt.toLocaleString('ja-JP')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      data-testid={`button-view-${notification.id}`}
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      data-testid={`button-delete-${notification.id}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">タイプ</p>
                    <p className="text-lg font-semibold text-gray-900">{notification.type === 'system' ? 'システム' : notification.type === 'marketing' ? 'マーケティング' : '一般'}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">対象</p>
                    <p className="text-lg font-semibold text-gray-900">{notification.target === 'all' ? '全ユーザー' : '特定ユーザー'}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">受信者数</p>
                    <p className="text-lg font-semibold text-gray-900">{notification.recipients.toLocaleString()}人</p>
                  </div>
                </div>
              </div>
            </AdminContentCard>
          </motion.div>
        ))}
      </div>
    </AdminPageContainer>
  );
};

export default NotificationManagement;
