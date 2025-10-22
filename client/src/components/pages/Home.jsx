import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  TrendingUp, 
  Award,
  CheckCircle,
  Target,
  Calendar,
  Users,
  ChevronRight,
  Video,
  FileText,
  Headphones
} from 'lucide-react';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');

  const stats = {
    coursesEnrolled: 12,
    coursesCompleted: 5,
    studyHours: 143,
    achievements: 8
  };

  const courses = [
    {
      id: 1,
      title: 'JavaScript基礎完全マスター',
      instructor: '山田太郎',
      progress: 65,
      thumbnail: '/logo-school.jpg',
      category: 'プログラミング',
      level: '初級',
      duration: '12時間',
      lessons: 48,
      rating: 4.8,
      students: 1250,
      type: 'video'
    },
    {
      id: 2,
      title: 'React開発実践コース',
      instructor: '佐藤花子',
      progress: 30,
      thumbnail: '/logo-school.jpg',
      category: 'プログラミング',
      level: '中級',
      duration: '18時間',
      lessons: 72,
      rating: 4.9,
      students: 890,
      type: 'video'
    },
    {
      id: 3,
      title: 'ビジネス英会話マスター',
      instructor: 'John Smith',
      progress: 0,
      thumbnail: '/logo-school.jpg',
      category: '語学',
      level: '中級',
      duration: '24時間',
      lessons: 96,
      rating: 4.7,
      students: 2100,
      type: 'audio'
    },
    {
      id: 4,
      title: 'データサイエンス入門',
      instructor: '鈴木一郎',
      progress: 15,
      thumbnail: '/logo-school.jpg',
      category: 'データ分析',
      level: '初級',
      duration: '16時間',
      lessons: 64,
      rating: 4.6,
      students: 750,
      type: 'video'
    }
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: 'React Hooks詳細解説',
      course: 'React開発実践コース',
      time: '今日 14:00',
      duration: '45分',
      type: 'live'
    },
    {
      id: 2,
      title: 'ビジネスプレゼンテーション',
      course: 'ビジネス英会話マスター',
      time: '明日 10:00',
      duration: '60分',
      type: 'scheduled'
    }
  ];

  const recommendations = [
    {
      id: 5,
      title: 'Python機械学習基礎',
      instructor: '田中美咲',
      thumbnail: '/logo-school.jpg',
      category: 'AI/機械学習',
      level: '中級',
      duration: '20時間',
      rating: 4.9,
      students: 1450,
      price: '¥12,800'
    },
    {
      id: 6,
      title: 'UX/UIデザイン実践',
      instructor: '高橋健太',
      thumbnail: '/logo-school.jpg',
      category: 'デザイン',
      level: '初級',
      duration: '14時間',
      rating: 4.8,
      students: 980,
      price: '¥9,800'
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'プログラミング': 'from-blue-500 to-blue-600',
      '語学': 'from-green-500 to-green-600',
      'データ分析': 'from-purple-500 to-purple-600',
      'AI/機械学習': 'from-red-500 to-red-600',
      'デザイン': 'from-blue-500 to-blue-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getTypeIcon = (type) => {
    const icons = {
      video: Video,
      audio: Headphones,
      text: FileText
    };
    return icons[type] || Video;
  };

  const filteredCourses = activeFilter === 'all' 
    ? courses 
    : courses.filter(c => c.progress > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
              おかえりなさい、{currentUser?.displayName || '学習者'}さん
            </h1>
            <p className="text-blue-100">
              今日も学習を続けましょう！
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4"
              data-testid="stat-enrolled"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
                  <div className="text-xs text-blue-100">受講中</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4"
              data-testid="stat-completed"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.coursesCompleted}</div>
                  <div className="text-xs text-blue-100">完了</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4"
              data-testid="stat-hours"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.studyHours}</div>
                  <div className="text-xs text-blue-100">学習時間</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4"
              data-testid="stat-achievements"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.achievements}</div>
                  <div className="text-xs text-blue-100">獲得バッジ</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upcoming Lessons */}
        {upcomingLessons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              予定されているレッスン
            </h2>
            <div className="space-y-4">
              {upcomingLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/course/${lesson.id}`)}
                  data-testid={`upcoming-lesson-${lesson.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {lesson.type === 'live' && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                        <span className="text-sm text-gray-600">{lesson.course}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{lesson.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lesson.time}
                        </span>
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                    <button
                      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                      data-testid={`button-join-${lesson.id}`}
                    >
                      <Play className="w-5 h-5" />
                      参加する
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">マイコース</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                data-testid="filter-all"
              >
                すべて
              </button>
              <button
                onClick={() => setActiveFilter('inProgress')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === 'inProgress'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                data-testid="filter-in-progress"
              >
                学習中
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course, index) => {
              const TypeIcon = getTypeIcon(course.type);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                  data-testid={`course-card-${course.id}`}
                >
                  <div className="relative h-48">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${getCategoryColor(course.category)} text-white text-xs font-semibold rounded-full`}>
                      {course.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-white text-xs">
                      <TypeIcon className="w-3 h-3" />
                      {course.level}
                    </div>
                    {course.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3">
                        <div className="flex items-center justify-between text-white text-xs mb-1">
                          <span>進捗状況</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200/30 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4">講師: {course.instructor}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        {course.lessons}レッスン
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {course.rating}
                      </div>
                    </div>

                    <button
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      data-testid={`button-continue-${course.id}`}
                    >
                      {course.progress > 0 ? '続きから学習' : 'コース開始'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recommended Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            おすすめのコース
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/course/${course.id}`)}
                data-testid={`recommended-course-${course.id}`}
              >
                <div className="flex">
                  <div className="w-40 h-40 flex-shrink-0">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getCategoryColor(course.category)} text-white text-xs font-semibold rounded-full mb-2`}>
                      {course.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students}
                      </span>
                      <span>{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">{course.price}</span>
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                        data-testid={`button-enroll-${course.id}`}
                      >
                        詳細を見る
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNavigationWithCreator active="home" />
      <div className="h-20"></div>
    </div>
  );
};

export default Home;
