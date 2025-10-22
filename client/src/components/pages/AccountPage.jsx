import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  GraduationCap,
  BarChart3,
  Users,
  DollarSign,
  Video,
  MessageSquare,
  Eye,
  Heart,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const AccountPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);

  // 学生用の統計
  const studentStats = {
    coursesEnrolled: 12,
    coursesCompleted: 5,
    studyHours: 143,
    certificates: 5
  };

  // 講師用の統計
  const instructorStats = {
    totalCourses: 8,
    totalStudents: 1250,
    totalEarnings: 3450000,
    averageRating: 4.8
  };

  useEffect(() => {
    const checkInstructorStatus = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsInstructor(userData.isCreator || userData.isInstructor || false);
        }
      } catch (error) {
        console.error('講師ステータス取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    checkInstructorStatus();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const studentMenuSections = [
    {
      title: 'アカウント設定',
      items: [
        { label: 'プロフィール編集', path: '/edit-profile', icon: User },
        { label: '設定', path: '/settings', icon: Settings },
        { label: '通知設定', path: '/settings/notifications', icon: Bell }
      ]
    },
    {
      title: '学習管理',
      items: [
        { label: 'マイコース', path: '/my-courses', icon: BookOpen },
        { label: '修了証明書', path: '/certificates', icon: Award },
        { label: '学習履歴', path: '/learning-history', icon: Clock }
      ]
    },
    {
      title: '支払い・サブスクリプション',
      items: [
        { label: '加入中のプラン', path: '/current-plan', icon: Star },
        { label: '支払い方法', path: '/payment-methods', icon: CreditCard },
        { label: '購入履歴', path: '/purchase-history', icon: FileText }
      ]
    },
    {
      title: 'サポート・法的情報',
      items: [
        { label: 'ヘルプセンター', path: '/help', icon: HelpCircle },
        { label: '利用規約', path: '/terms', icon: FileText },
        { label: 'プライバシーポリシー', path: '/privacy', icon: Shield }
      ]
    }
  ];

  const instructorMenuSections = [
    {
      title: '講師ダッシュボード',
      items: [
        { label: '講師ダッシュボード', path: '/creator-dashboard', icon: BarChart3 },
        { label: 'コース管理', path: '/my-posts', icon: BookOpen },
        { label: 'コース作成', path: '/create-post', icon: Video }
      ]
    },
    {
      title: '収益管理',
      items: [
        { label: '収益概要', path: '/earnings', icon: DollarSign },
        { label: '振込申請', path: '/transfer-request', icon: CreditCard },
        { label: '銀行口座登録', path: '/bank-account', icon: FileText }
      ]
    },
    {
      title: '学生管理',
      items: [
        { label: '受講生一覧', path: '/students', icon: Users },
        { label: 'メッセージ', path: '/messages', icon: MessageSquare },
        { label: 'レビュー管理', path: '/reviews', icon: Star }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

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
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-xl">
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold" data-testid="text-username">
                  {currentUser?.displayName || 'ユーザー'}
                </h1>
                {isInstructor && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                    <GraduationCap className="w-3 h-3" />
                    <span>講師</span>
                  </div>
                )}
              </div>
              <p className="text-blue-100 text-sm">
                {currentUser?.email}
              </p>
            </div>
            <button
              onClick={() => navigate('/edit-profile')}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all font-medium"
              data-testid="button-edit-profile"
            >
              編集
            </button>
          </div>

          {/* Stats Grid - 学生または講師によって異なる */}
          {isInstructor ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                data-testid="stat-courses"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-white/80" />
                  <span className="text-xs text-white/80">コース数</span>
                </div>
                <div className="text-2xl font-bold">{instructorStats.totalCourses}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                data-testid="stat-students"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-white/80" />
                  <span className="text-xs text-white/80">受講生</span>
                </div>
                <div className="text-2xl font-bold">{instructorStats.totalStudents.toLocaleString()}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                data-testid="stat-earnings"
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-white/80" />
                  <span className="text-xs text-white/80">総収益</span>
                </div>
                <div className="text-2xl font-bold">¥{(instructorStats.totalEarnings / 10000).toFixed(0)}万</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                data-testid="stat-rating"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-white/80" />
                  <span className="text-xs text-white/80">平均評価</span>
                </div>
                <div className="text-2xl font-bold">{instructorStats.averageRating}</div>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                data-testid="stat-enrolled"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-white/80" />
                  <span className="text-xs text-white/80">受講中</span>
                </div>
                <div className="text-2xl font-bold">{studentStats.coursesEnrolled}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                data-testid="stat-completed"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-white/80" />
                  <span className="text-xs text-white/80">完了</span>
                </div>
                <div className="text-2xl font-bold">{studentStats.coursesCompleted}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                data-testid="stat-hours"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-white/80" />
                  <span className="text-xs text-white/80">学習時間</span>
                </div>
                <div className="text-2xl font-bold">{studentStats.studyHours}h</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                data-testid="stat-certificates"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-white/80" />
                  <span className="text-xs text-white/80">修了証</span>
                </div>
                <div className="text-2xl font-bold">{studentStats.certificates}</div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-6xl mx-auto px-6 -mt-24">
        {/* 講師登録バナー（学生のみ表示） */}
        {!isInstructor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => navigate('/edit-profile')}
            data-testid="button-become-instructor"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">講師になって知識を共有しませんか？</h3>
                <p className="text-sm text-blue-100">コースを作成して収益を得ることができます</p>
              </div>
              <ChevronRight className="w-6 h-6" />
            </div>
          </motion.div>
        )}

        {/* Menu Items */}
        <div className="space-y-4">
          {(isInstructor ? [...instructorMenuSections, ...studentMenuSections] : studentMenuSections).map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * sectionIndex }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100"
            >
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {section.items.map((item) => (
                  <motion.button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-blue-50 transition-colors group"
                    data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="flex-1 text-left font-medium text-gray-700 group-hover:text-blue-600">
                      {item.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
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
            className="w-full bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center gap-4 hover:bg-red-50 transition-colors group border border-blue-100"
            data-testid="button-logout"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <span className="flex-1 text-left font-bold text-red-600">
              ログアウト
            </span>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </motion.button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">ログアウトしますか？</h3>
              </div>
              <p className="text-gray-600 mb-6">
                ログアウトすると、再度ログインが必要になります。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  data-testid="button-cancel-logout"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  data-testid="button-confirm-logout"
                >
                  ログアウト
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigationWithCreator active="account" />
    </div>
  );
};

export default AccountPage;
