import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  FileText, 
  ChevronRight, 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  HelpCircle,
  BookOpen,
  Award,
  Star,
  Clock,
  TrendingUp,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const AccountPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const stats = {
    coursesEnrolled: 12,
    coursesCompleted: 5,
    studyHours: 143,
    certificates: 5
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuSections = [
    {
      title: 'アカウント設定',
      icon: User,
      items: [
        { label: 'プロフィール編集', path: '/edit-profile', icon: User },
        { label: '設定', path: '/settings', icon: Settings },
        { label: '通知設定', path: '/settings/notifications', icon: Bell }
      ]
    },
    {
      title: '学習管理',
      icon: BookOpen,
      items: [
        { label: 'マイコース', path: '/my-courses', icon: BookOpen },
        { label: '修了証明書', path: '/certificates', icon: Award },
        { label: '学習履歴', path: '/learning-history', icon: Clock }
      ]
    },
    {
      title: '支払い・サブスクリプション',
      icon: CreditCard,
      items: [
        { label: '加入中のプラン', path: '/current-plan', icon: Star },
        { label: '支払い方法', path: '/payment-methods', icon: CreditCard },
        { label: '購入履歴', path: '/purchase-history', icon: FileText }
      ]
    },
    {
      title: 'サポート・法的情報',
      icon: HelpCircle,
      items: [
        { label: 'ヘルプセンター', path: '/help', icon: HelpCircle },
        { label: '利用規約', path: '/terms', icon: FileText },
        { label: 'プライバシーポリシー', path: '/privacy', icon: Shield }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-24">
      {/* Header with Profile */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-8 pb-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" data-testid="text-username">
                {currentUser?.displayName || 'ユーザー'}
              </h1>
              <p className="text-blue-100">
                {currentUser?.email}
              </p>
            </div>
            <button
              onClick={() => navigate('/edit-profile')}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
              data-testid="button-edit-profile"
            >
              編集
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              data-testid="stat-enrolled"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-white/80" />
                <span className="text-xs text-white/80">受講中</span>
              </div>
              <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              data-testid="stat-completed"
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-white/80" />
                <span className="text-xs text-white/80">完了</span>
              </div>
              <div className="text-2xl font-bold">{stats.coursesCompleted}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              data-testid="stat-hours"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-white/80" />
                <span className="text-xs text-white/80">学習時間</span>
              </div>
              <div className="text-2xl font-bold">{stats.studyHours}h</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              data-testid="stat-certificates"
            >
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-white/80" />
                <span className="text-xs text-white/80">修了証</span>
              </div>
              <div className="text-2xl font-bold">{stats.certificates}</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => (
                  <motion.button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-all group"
                    data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center justify-center gap-3 hover:bg-red-50 transition-all group"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-600">ログアウト</span>
          </motion.button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">ログアウトしますか？</h3>
            <p className="text-gray-600 mb-6">
              学習の進捗は保存されます。いつでも戻ってきて続きから学習できます。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                data-testid="button-cancel-logout"
              >
                キャンセル
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                data-testid="button-confirm-logout"
              >
                ログアウト
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNavigationWithCreator active="account" />
    </div>
  );
};

export default AccountPage;
