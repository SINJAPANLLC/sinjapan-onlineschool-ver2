import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  HelpCircle, 
  Search,
  BookOpen,
  User,
  Settings,
  CreditCard,
  Shield,
  AlertTriangle,
  UserPlus,
  Lock,
  Trash2,
  Bell,
  Globe,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  Calendar,
  FileText,
  GraduationCap,
  Video,
  Award,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const HelpPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'すべて', icon: HelpCircle, color: 'from-blue-500 to-blue-600' },
    { id: 'getting-started', name: 'はじめに', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { id: 'learning', name: '学習', icon: GraduationCap, color: 'from-blue-500 to-blue-600' },
    { id: 'instructor', name: '講師', icon: User, color: 'from-orange-500 to-orange-600' },
    { id: 'account', name: 'アカウント', icon: User, color: 'from-indigo-500 to-indigo-600' },
    { id: 'billing', name: '料金・支払い', icon: CreditCard, color: 'from-red-500 to-red-600' },
    { id: 'troubleshooting', name: 'トラブル', icon: AlertTriangle, color: 'from-blue-500 to-blue-600' }
  ];

  const helpArticles = [
    { id: 'what-is-sin-japan', title: 'SIN JAPAN ONLINE SCHOOLとは？', category: 'getting-started', content: 'プロ講師による質の高いオンライン学習プラットフォームです。', icon: BookOpen },
    { id: 'how-to-signup', title: 'アカウント作成方法', category: 'getting-started', content: 'メールアドレスまたは電話番号でアカウントを作成できます。', icon: UserPlus },
    { id: 'first-steps', title: '初回ログイン後の手順', category: 'getting-started', content: 'プロフィール設定、興味のある分野選択、コースを探しましょう。', icon: CheckCircle },
    
    { id: 'enroll-course', title: 'コースに登録する方法', category: 'learning', content: 'コースページから「受講する」ボタンをクリックして登録できます。', icon: BookOpen },
    { id: 'watch-lessons', title: 'レッスンを視聴する', category: 'learning', content: 'コースダッシュボードからレッスンビデオを視聴できます。', icon: Video },
    { id: 'track-progress', title: '学習進捗を確認する', category: 'learning', content: 'マイページで受講中のコースと進捗状況を確認できます。', icon: Award },
    { id: 'certificates', title: '修了証明書の取得', category: 'learning', content: 'コース完了後、修了証明書をダウンロードできます。', icon: Award },
    
    { id: 'become-instructor', title: '講師になる方法', category: 'instructor', content: 'プロフィール設定で「講師として登録」を選択してください。', icon: GraduationCap },
    { id: 'create-course', title: 'コースを作成する', category: 'instructor', content: '講師ダッシュボードから新しいコースを作成できます。', icon: BookOpen },
    { id: 'manage-students', title: '学生を管理する', category: 'instructor', content: '講師ダッシュボードで学生の進捗とエンゲージメントを確認できます。', icon: User },
    { id: 'instructor-earnings', title: '収益を確認する', category: 'instructor', content: '講師ダッシュボードで収益と支払い状況を確認できます。', icon: CreditCard },
    
    { id: 'profile-setup', title: 'プロフィール設定方法', category: 'account', content: 'プロフィール写真、自己紹介、専門分野を設定できます。', icon: User },
    { id: 'change-password', title: 'パスワード変更方法', category: 'account', content: '設定 > アカウント > パスワード変更から変更できます。', icon: Lock },
    { id: 'delete-account', title: 'アカウント削除方法', category: 'account', content: '設定 > アカウント > アカウント削除から削除できます。', icon: Trash2 },
    
    { id: 'payment-methods', title: '支払い方法の登録', category: 'billing', content: 'クレジットカード、デビットカード、PayPalで支払いできます。', icon: CreditCard },
    { id: 'subscription-management', title: 'サブスクリプション管理', category: 'billing', content: '設定 > サブスクリプションからプランの変更・解約ができます。', icon: Calendar },
    { id: 'billing-history', title: '支払い履歴の確認', category: 'billing', content: '設定 > 支払い履歴から過去の支払いを確認できます。', icon: FileText },
    
    { id: 'login-issues', title: 'ログインできない', category: 'troubleshooting', content: 'パスワードリセット、アカウント復旧手順をご案内します。', icon: AlertTriangle },
    { id: 'video-playback', title: '動画が再生できない', category: 'troubleshooting', content: 'インターネット接続を確認し、ブラウザを最新版に更新してください。', icon: Video },
    { id: 'slow-loading', title: '読み込みが遅い', category: 'troubleshooting', content: 'インターネット接続、アプリのキャッシュクリアを試してください。', icon: Clock }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (categoryId) => {
    const category = helpCategories.find(cat => cat.id === categoryId);
    return category ? category.color : 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
              data-testid="button-back"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <HelpCircle className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ヘルプセンター</h1>
                <p className="text-sm text-blue-100">よくある質問と解決策</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input 
              type="text" 
              placeholder="ヘルプを検索..." 
              className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium shadow-lg" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              data-testid="input-search" 
            />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-5 text-gray-800">カテゴリ</h2>
          <div className="grid grid-cols-2 gap-3">
            {helpCategories.map((category, index) => (
              <motion.button 
                key={category.id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.05 * index }} 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setSelectedCategory(category.id)} 
                className={`p-4 rounded-xl text-left transition-all shadow-md ${
                  selectedCategory === category.id 
                    ? `bg-gradient-to-r ${category.color} text-white` 
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
                }`} 
                data-testid={`button-category-${category.id}`}
              >
                <div className="flex items-center space-x-3">
                  <category.icon className="w-6 h-6" />
                  <span className="font-bold text-sm">{category.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Help Articles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-5 text-gray-800">
            {selectedCategory === 'all' ? 'すべての記事' : helpCategories.find(c => c.id === selectedCategory)?.name}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredArticles.length}件)
            </span>
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.05 * index }}
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl cursor-pointer transition-all border-2 border-transparent hover:border-blue-200"
                  data-testid={`article-${article.id}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(article.category)} shadow-md flex items-center justify-center flex-shrink-0`}>
                      <article.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{article.title}</h3>
                      <p className="text-sm text-gray-600">{article.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">検索結果が見つかりませんでした</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 shadow-lg text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">お問い合わせ</h3>
              <p className="text-sm text-blue-100">解決しない場合はサポートまで</p>
            </div>
          </div>
          <button className="w-full px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all">
            サポートに連絡
          </button>
        </motion.div>
      </div>

      <BottomNavigationWithCreator active="account" />
    </div>
  );
};

export default HelpPage;
