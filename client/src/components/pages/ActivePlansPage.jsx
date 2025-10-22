import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit3, Trash2, Users, DollarSign, Calendar, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const ActivePlansPage = () => {
  const navigate = useNavigate();
  const [showInactive, setShowInactive] = useState(false);

  const plans = [
    { id: 1, name: 'ベーシックプラン', price: 1980, subscribers: 1250, revenue: 2475000, status: 'active', description: '基本的なコンテンツを提供するプラン', features: ['月5本の動画投稿', 'DM機能', '基本サポート'], createdAt: '2024-01-15', lastUpdated: '2024-01-20' },
    { id: 2, name: 'プレミアムプラン', price: 3980, subscribers: 850, revenue: 3383000, status: 'active', description: '高品質なコンテンツと特別な特典', features: ['月10本の動画投稿', 'DM機能', '優先サポート', '限定コンテンツ'], createdAt: '2024-01-10', lastUpdated: '2024-01-18' },
    { id: 3, name: 'VIPプラン', price: 5980, subscribers: 420, revenue: 2511600, status: 'active', description: '最高級のコンテンツと専用サービス', features: ['無制限動画投稿', 'DM機能', '24時間サポート', '限定コンテンツ', '個別相談'], createdAt: '2024-01-05', lastUpdated: '2024-01-22' },
    { id: 4, name: 'テストプラン', price: 500, subscribers: 0, revenue: 0, status: 'inactive', description: 'テスト用のプラン', features: ['テスト機能'], createdAt: '2024-01-25', lastUpdated: '2024-01-25' }
  ];

  const activePlans = plans.filter(plan => plan.status === 'active');
  const inactivePlans = plans.filter(plan => plan.status === 'inactive');

  const formatCurrency = (amount) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 }).format(amount);
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    else if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'inactive': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'アクティブ';
      case 'inactive': return '非アクティブ';
      default: return '不明';
    }
  };

  const totalRevenue = activePlans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = activePlans.reduce((sum, plan) => sum + plan.subscribers, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 bg-gradient-to-r from-pink-500 to-pink-600 border-b border-pink-300 p-6 flex items-center justify-between z-10 shadow-lg">
        <div className="flex items-center">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="text-white mr-4 p-2 hover:bg-white/20 rounded-full" data-testid="button-back">
            <ArrowLeft size={24} />
          </motion.button>
          <div className="flex items-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles className="w-7 h-7 text-white mr-3" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">運営中のプラン</h1>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/create-plan')} className="bg-white text-pink-600 px-4 py-2 rounded-xl font-bold flex items-center space-x-1 shadow-lg hover:shadow-xl transition-all" data-testid="button-create">
          <Plus className="w-4 h-4" />
          <span>新規作成</span>
        </motion.button>
      </motion.div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-5 shadow-xl border-2 border-pink-200 relative overflow-hidden">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
            <div className="relative z-10">
              <p className="text-sm text-pink-700 font-semibold mb-1">総売上</p>
              <p className="text-3xl font-bold text-pink-900" data-testid="text-total-revenue">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="absolute bottom-2 right-2 w-10 h-10 text-pink-300 opacity-50" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-5 shadow-xl border-2 border-blue-200 relative overflow-hidden">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }} className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
            <div className="relative z-10">
              <p className="text-sm text-blue-700 font-semibold mb-1">総加入者数</p>
              <p className="text-3xl font-bold text-blue-900" data-testid="text-total-subscribers">{formatNumber(totalSubscribers)}</p>
            </div>
            <Users className="absolute bottom-2 right-2 w-10 h-10 text-blue-300 opacity-50" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 shadow-xl border-2 border-pink-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">プラン一覧</h3>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowInactive(!showInactive)} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 font-semibold" data-testid="button-toggle-inactive">
              {showInactive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showInactive ? '非アクティブを非表示' : '非アクティブを表示'}</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">アクティブプラン</h3>
          {activePlans.map((plan, index) => (
            <motion.div key={plan.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} whileHover={{ scale: 1.02, y: -2 }} className="bg-white rounded-2xl p-6 shadow-xl border-2 border-pink-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-2xl font-bold text-gray-900" data-testid={`text-plan-name-${plan.id}`}>{plan.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(plan.status)}`} data-testid={`text-status-${plan.id}`}>{getStatusText(plan.status)}</span>
                  </div>
                  <p className="text-gray-600 font-medium mb-4">{plan.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><p className="text-sm text-gray-500 font-medium">価格</p><p className="text-xl font-bold text-gray-900" data-testid={`text-price-${plan.id}`}>{formatCurrency(plan.price)}/月</p></div>
                    <div><p className="text-sm text-gray-500 font-medium">加入者数</p><p className="text-xl font-bold text-gray-900" data-testid={`text-subscribers-${plan.id}`}>{formatNumber(plan.subscribers)}人</p></div>
                    <div><p className="text-sm text-gray-500 font-medium">月間売上</p><p className="text-xl font-bold text-green-600" data-testid={`text-revenue-${plan.id}`}>{formatCurrency(plan.revenue)}</p></div>
                    <div><p className="text-sm text-gray-500 font-medium">最終更新</p><p className="text-sm text-gray-600">{plan.lastUpdated}</p></div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-3 border border-pink-100">
                    <p className="text-xs font-bold text-pink-700 mb-2">プラン特典</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((feature, idx) => (
                        <span key={idx} className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-pink-100" data-testid={`text-feature-${plan.id}-${idx}`}>{feature}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(`/edit-plan/${plan.id}`)} className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" data-testid={`button-edit-${plan.id}`}>
                    <Edit3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" data-testid={`button-delete-${plan.id}`}>
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {showInactive && inactivePlans.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-500">非アクティブプラン</h3>
            {inactivePlans.map((plan) => (
              <div key={plan.id} className="bg-gray-100 rounded-2xl p-6 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-700">{plan.name}</h4>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(plan.status)}`}>{getStatusText(plan.status)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigationWithCreator active="account" />
    </div>
  );
};

export default ActivePlansPage;
