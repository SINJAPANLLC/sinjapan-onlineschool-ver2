import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  Globe,
  Mail,
  Users,
  UserX,
  User,
  Phone,
  AtSign,
  Bell,
  BookOpen,
  Award,
  HelpCircle,
  Shield,
  FileText,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const SettingsPage = () => {
  const navigate = useNavigate();
  
  const [rejectMessages, setRejectMessages] = useState(false);

  const settingsGroups = [
    {
      title: '学習設定',
      icon: BookOpen,
      items: [
        {
          id: 'learning-preferences',
          title: '学習の好み',
          subtitle: '興味のある分野、学習スタイル',
          icon: Award,
          action: () => navigate('/settings/learning-preferences'),
        },
        {
          id: 'language',
          title: '言語設定',
          subtitle: 'インターフェース言語',
          icon: Globe,
          action: () => navigate('/settings/language'),
        },
      ]
    },
    {
      title: 'アカウント設定',
      icon: User,
      items: [
        {
          id: 'personal-info',
          title: '個人情報',
          subtitle: '名前、生年月日',
          icon: User,
          action: () => navigate('/settings/personal-info'),
        },
        {
          id: 'phone-verification',
          title: '電話番号認証',
          subtitle: 'アカウントのセキュリティ',
          icon: Phone,
          action: () => navigate('/settings/phone-verification'),
        },
        {
          id: 'email-verification',
          title: 'メールアドレス認証',
          subtitle: '重要な通知を受け取る',
          icon: AtSign,
          action: () => navigate('/settings/email-verification'),
        },
      ]
    },
    {
      title: '講師設定',
      icon: GraduationCap,
      items: [
        {
          id: 'instructor-profile',
          title: '講師プロフィール',
          subtitle: '専門分野、経歴',
          icon: GraduationCap,
          action: () => navigate('/edit-profile'),
        },
        {
          id: 'course-management',
          title: 'コース管理',
          subtitle: '作成したコース',
          icon: BookOpen,
          action: () => navigate('/creator-dashboard'),
        },
      ]
    },
    {
      title: '通知設定',
      icon: Bell,
      items: [
        {
          id: 'email-notifications',
          title: 'メール通知設定',
          subtitle: 'コース更新、メッセージ通知',
          icon: Mail,
          action: () => navigate('/settings/email-notifications'),
        },
        {
          id: 'notifications',
          title: 'お知らせ',
          subtitle: 'システムからのお知らせ',
          icon: Bell,
          action: () => navigate('/settings/notifications'),
        },
      ]
    },
    {
      title: 'コミュニティ',
      icon: Users,
      items: [
        {
          id: 'follow-list',
          title: 'フォロー中',
          subtitle: 'フォローしている講師',
          icon: Users,
          action: () => navigate('/settings/follow-list'),
        },
        {
          id: 'blocked-users',
          title: 'ブロックしたユーザー',
          subtitle: 'ブロックリスト',
          icon: UserX,
          action: () => navigate('/settings/blocked-users'),
        },
      ]
    },
    {
      title: 'サポート',
      icon: HelpCircle,
      items: [
        {
          id: 'help',
          title: 'ヘルプ',
          subtitle: 'よくある質問',
          icon: HelpCircle,
          action: () => navigate('/settings/help'),
        },
        {
          id: 'privacy',
          title: 'プライバシーポリシー',
          subtitle: '個人情報の取り扱い',
          icon: Shield,
          action: () => navigate('/privacy'),
        },
        {
          id: 'terms',
          title: '利用規約',
          subtitle: 'サービス利用規約',
          icon: FileText,
          action: () => navigate('/terms'),
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
              data-testid="button-back"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">設定</h1>
              <p className="text-sm text-blue-100">アカウントと学習設定</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <group.icon className="w-5 h-5" />
                {group.title}
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {group.items.map((item, itemIndex) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 transition-all text-left"
                  data-testid={`setting-${item.id}`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-4"
        >
          <p className="text-sm text-gray-500">
            SIN JAPAN ONLINE SCHOOL
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Version 1.0.0
          </p>
        </motion.div>
      </div>

      <BottomNavigationWithCreator active="account" />
    </div>
  );
};

export default SettingsPage;
