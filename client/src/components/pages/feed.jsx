import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users, 
  Filter,
  Search,
  TrendingUp,
  Award,
  Play,
  ChevronRight
} from 'lucide-react';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';
import { useAuth } from '../../context/AuthContext';

const SocialFeedScreen = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', label: 'すべて', icon: BookOpen },
    { id: 'programming', label: 'プログラミング', icon: BookOpen },
    { id: 'design', label: 'デザイン', icon: BookOpen },
    { id: 'business', label: 'ビジネス', icon: BookOpen },
    { id: 'language', label: '語学', icon: BookOpen },
    { id: 'data', label: 'データサイエンス', icon: BookOpen },
  ];

  const levels = [
    { id: 'all', label: 'すべてのレベル' },
    { id: 'beginner', label: '初級' },
    { id: 'intermediate', label: '中級' },
    { id: 'advanced', label: '上級' },
  ];

  const courses = [
    {
      id: 1,
      title: 'JavaScript完全マスターコース',
      instructor: '山田太郎',
      instructorAvatar: 'https://i.pravatar.cc/150?img=12',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',
      rating: 4.8,
      students: 1250,
      duration: '24時間',
      lessons: 120,
      level: 'beginner',
      category: 'programming',
      price: 12800,
      description: 'JavaScriptの基礎から応用まで、実践的なプロジェクトを通して学びます。',
      tags: ['JavaScript', 'Web開発', '初心者向け']
    },
    {
      id: 2,
      title: 'React開発実践コース',
      instructor: '佐藤花子',
      instructorAvatar: 'https://i.pravatar.cc/150?img=5',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      rating: 4.9,
      students: 980,
      duration: '18時間',
      lessons: 90,
      level: 'intermediate',
      category: 'programming',
      price: 15800,
      description: 'Reactを使った実践的なアプリケーション開発を学びます。',
      tags: ['React', 'フロントエンド', 'JavaScript']
    },
    {
      id: 3,
      title: 'ビジネス英会話マスター',
      instructor: 'John Smith',
      instructorAvatar: 'https://i.pravatar.cc/150?img=33',
      thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
      rating: 4.7,
      students: 850,
      duration: '15時間',
      lessons: 60,
      level: 'intermediate',
      category: 'language',
      price: 9800,
      description: 'ビジネスシーンで使える実践的な英会話を身につけます。',
      tags: ['英語', 'ビジネス', '会話']
    },
    {
      id: 4,
      title: 'Python機械学習基礎',
      instructor: '田中美咲',
      instructorAvatar: 'https://i.pravatar.cc/150?img=9',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      rating: 4.9,
      students: 720,
      duration: '30時間',
      lessons: 150,
      level: 'advanced',
      category: 'data',
      price: 18800,
      description: 'Pythonを使った機械学習の基礎から実装まで学びます。',
      tags: ['Python', 'AI', '機械学習']
    },
    {
      id: 5,
      title: 'UX/UIデザイン実践',
      instructor: '高橋健太',
      instructorAvatar: 'https://i.pravatar.cc/150?img=15',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      rating: 4.8,
      students: 680,
      duration: '20時間',
      lessons: 80,
      level: 'beginner',
      category: 'design',
      price: 13800,
      description: 'ユーザー体験を重視したデザインの基礎から実践まで。',
      tags: ['UX', 'UI', 'デザイン']
    },
    {
      id: 6,
      title: 'ビジネス戦略とマーケティング',
      instructor: '鈴木一郎',
      instructorAvatar: 'https://i.pravatar.cc/150?img=8',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      rating: 4.6,
      students: 520,
      duration: '12時間',
      lessons: 50,
      level: 'intermediate',
      category: 'business',
      price: 11800,
      description: '効果的なビジネス戦略とマーケティング手法を学びます。',
      tags: ['マーケティング', '戦略', 'ビジネス']
    },
  ];

  const filteredCourses = courses.filter(course => {
    if (selectedCategory !== 'all' && course.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'popular') return b.students - a.students;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return b.id - a.id;
    return 0;
  });

  const getLevelBadgeColor = (level) => {
    if (level === 'beginner') return 'bg-green-100 text-green-700';
    if (level === 'intermediate') return 'bg-blue-100 text-blue-700';
    if (level === 'advanced') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getLevelLabel = (level) => {
    if (level === 'beginner') return '初級';
    if (level === 'intermediate') return '中級';
    if (level === 'advanced') return '上級';
    return level;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">コースカタログ</h1>
              <p className="text-sm text-blue-100">あなたに最適なコースを見つけよう</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="コースを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              data-testid="input-search-course"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-[148px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Category Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              カテゴリー
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  data-testid={`category-${category.id}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level and Sort Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedLevel === level.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                data-testid={`level-${level.id}`}
              >
                {level.label}
              </button>
            ))}
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <button
              onClick={() => setSortBy('popular')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === 'popular'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              data-testid="sort-popular"
            >
              人気順
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === 'rating'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              data-testid="sort-rating"
            >
              評価順
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <p className="text-gray-600">
            {sortedCourses.length}件のコースが見つかりました
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => navigate(`/course/${course.id}`)}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
              data-testid={`course-${course.id}`}
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelBadgeColor(course.level)}`}>
                    {getLevelLabel(course.level)}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                    <img src={course.instructorAvatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{course.instructor}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {course.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      ¥{course.price.toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    data-testid={`button-enroll-${course.id}`}
                  >
                    詳細
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {sortedCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">コースが見つかりませんでした</h3>
            <p className="text-gray-500 mb-4">検索条件を変更してみてください</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              data-testid="button-reset-filters"
            >
              フィルターをリセット
            </button>
          </div>
        )}
      </div>

      <BottomNavigationWithCreator active="feed" />
    </div>
  );
};

export default SocialFeedScreen;
