import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Users, 
  BookOpen, 
  Award,
  Clock,
  ChevronRight,
  Medal
} from 'lucide-react';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';
import { useNavigate } from 'react-router-dom';

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [activeTimeFilter, setActiveTimeFilter] = useState('weekly');
  const navigate = useNavigate();

  const tabs = [
    { id: 'courses', label: 'コースランキング', icon: BookOpen },
    { id: 'students', label: '学習者ランキング', icon: Users },
  ];

  const timeFilters = [
    { id: 'daily', label: '今日' },
    { id: 'weekly', label: '今週' },
    { id: 'monthly', label: '今月' },
    { id: 'allTime', label: '全期間' },
  ];

  const topCourses = [
    {
      id: 1,
      rank: 1,
      title: 'JavaScript基礎完全マスター',
      instructor: '山田太郎',
      students: 1250,
      rating: 4.8,
      category: 'プログラミング',
      thumbnail: '/logo192.png',
      change: 'up'
    },
    {
      id: 2,
      rank: 2,
      title: 'React開発実践コース',
      instructor: '佐藤花子',
      students: 980,
      rating: 4.9,
      category: 'プログラミング',
      thumbnail: '/logo192.png',
      change: 'same'
    },
    {
      id: 3,
      rank: 3,
      title: 'ビジネス英会話マスター',
      instructor: 'John Smith',
      students: 850,
      rating: 4.7,
      category: '語学',
      thumbnail: '/logo192.png',
      change: 'down'
    },
    {
      id: 4,
      rank: 4,
      title: 'Python機械学習基礎',
      instructor: '田中美咲',
      students: 720,
      rating: 4.9,
      category: 'AI/機械学習',
      thumbnail: '/logo192.png',
      change: 'up'
    },
    {
      id: 5,
      rank: 5,
      title: 'UX/UIデザイン実践',
      instructor: '高橋健太',
      students: 680,
      rating: 4.8,
      category: 'デザイン',
      thumbnail: '/logo192.png',
      change: 'up'
    }
  ];

  const topStudents = [
    {
      id: 1,
      rank: 1,
      name: '鈴木一郎',
      avatar: '/logo192.png',
      points: 15420,
      coursesCompleted: 24,
      badges: 18,
      change: 'up'
    },
    {
      id: 2,
      rank: 2,
      name: '佐藤花子',
      avatar: '/logo192.png',
      points: 14890,
      coursesCompleted: 22,
      badges: 16,
      change: 'same'
    },
    {
      id: 3,
      rank: 3,
      name: '田中健太',
      avatar: '/logo192.png',
      points: 13560,
      coursesCompleted: 20,
      badges: 15,
      change: 'down'
    },
    {
      id: 4,
      rank: 4,
      name: '山本美咲',
      avatar: '/logo192.png',
      points: 12340,
      coursesCompleted: 18,
      badges: 14,
      change: 'up'
    },
    {
      id: 5,
      rank: 5,
      name: '中村太郎',
      avatar: '/logo192.png',
      points: 11890,
      coursesCompleted: 17,
      badges: 13,
      change: 'up'
    }
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return { bg: 'from-yellow-400 to-yellow-600', icon: '🥇', color: 'text-yellow-600' };
    if (rank === 2) return { bg: 'from-gray-300 to-gray-500', icon: '🥈', color: 'text-gray-600' };
    if (rank === 3) return { bg: 'from-orange-400 to-orange-600', icon: '🥉', color: 'text-orange-600' };
    return { bg: 'from-blue-400 to-blue-600', icon: null, color: 'text-blue-600' };
  };

  const getChangeIcon = (change) => {
    if (change === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change === 'down') return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <span className="text-gray-400 text-xs">-</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ランキング</h1>
              <p className="text-sm text-blue-100">トップコースと学習者</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-[156px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {timeFilters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveTimeFilter(filter.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTimeFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                data-testid={`filter-${filter.id}`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {topCourses.map((course, index) => {
              const badge = getRankBadge(course.rank);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/course/${course.id}`)}
                  data-testid={`course-rank-${course.rank}`}
                >
                  <div className="flex items-center p-4">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0 w-16 text-center">
                      {badge.icon ? (
                        <div className="text-4xl">{badge.icon}</div>
                      ) : (
                        <div className={`text-3xl font-bold ${badge.color}`}>
                          #{course.rank}
                        </div>
                      )}
                      <div className="mt-1">{getChangeIcon(course.change)}</div>
                    </div>

                    {/* Course Image */}
                    <div className="flex-shrink-0 w-24 h-24 ml-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 ml-4">
                      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${badge.bg} text-white text-xs font-semibold rounded-full mb-2`}>
                        {course.category}
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">講師: {course.instructor}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.students}人
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {course.rating}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'students' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {topStudents.map((student, index) => {
              const badge = getRankBadge(student.rank);
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => navigate(`/profile/${student.id}`)}
                  data-testid={`student-rank-${student.rank}`}
                >
                  <div className="flex items-center p-4">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0 w-16 text-center">
                      {badge.icon ? (
                        <div className="text-4xl">{badge.icon}</div>
                      ) : (
                        <div className={`text-3xl font-bold ${badge.color}`}>
                          #{student.rank}
                        </div>
                      )}
                      <div className="mt-1">{getChangeIcon(student.change)}</div>
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-200">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 ml-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {student.name}
                      </h3>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 text-xs">ポイント</div>
                          <div className="font-bold text-blue-600">{student.points.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">完了コース</div>
                          <div className="font-bold text-green-600">{student.coursesCompleted}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">バッジ</div>
                          <div className="font-bold text-yellow-600 flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {student.badges}
                          </div>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <BottomNavigationWithCreator active="ranking" />
    </div>
  );
};

export default RankingPage;
