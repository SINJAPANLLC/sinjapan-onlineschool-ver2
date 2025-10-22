import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Star,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Award,
  Clock,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    completionRate: 0
  });
  
  const [coursesData, setCoursesData] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInstructorData = async () => {
      try {
        setIsLoading(true);

        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        const coursesRef = collection(db, 'courses');
        // 後方互換性：creatorIdとinstructorId両方をクエリ
        const creatorIdQuery = query(coursesRef, where('creatorId', '==', currentUser.uid));
        const instructorIdQuery = query(coursesRef, where('instructorId', '==', currentUser.uid));
        
        const [creatorSnapshot, instructorSnapshot] = await Promise.all([
          getDocs(creatorIdQuery),
          getDocs(instructorIdQuery)
        ]);
        
        // 結果をマージして重複を削除
        const coursesDocs = new Map();
        [...creatorSnapshot.docs, ...instructorSnapshot.docs].forEach(doc => {
          coursesDocs.set(doc.id, doc);
        });
        const coursesSnapshot = { docs: Array.from(coursesDocs.values()) };
        
        let totalStudents = 0;
        let totalRevenue = 0;
        let totalRating = 0;
        let totalReviews = 0;
        
        const coursesArray = coursesSnapshot.docs.map(doc => {
          const data = doc.data();
          totalStudents += data.students || 0;
          totalRevenue += (data.price || 0) * (data.students || 0);
          totalRating += (data.rating || 0) * (data.reviews || 0);
          totalReviews += data.reviews || 0;
          
          return {
            id: doc.id,
            title: data.title || 'コース名',
            students: data.students || 0,
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            revenue: (data.price || 0) * (data.students || 0),
            thumbnail: data.thumbnail || '/logo-school.jpg',
            category: data.category || 'other',
            level: data.level || 'beginner',
            lessons: data.lessons?.length || 0,
            completionRate: data.completionRate || 0
          };
        });

        setCoursesData(coursesArray);

        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        setStats({
          totalStudents,
          totalCourses: coursesArray.length,
          totalRevenue,
          averageRating: averageRating.toFixed(1),
          totalReviews,
          completionRate: 75
        });

      } catch (error) {
        console.error('Error fetching instructor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructorData();
  }, [currentUser, selectedPeriod]);

  const periods = [
    { id: 'day', label: '今日' },
    { id: 'week', label: '今週' },
    { id: 'month', label: '今月' },
    { id: 'year', label: '今年' },
  ];

  const tabs = [
    { id: 'overview', label: '概要', icon: BarChart3 },
    { id: 'courses', label: 'コース', icon: BookOpen },
    { id: 'students', label: '学生', icon: Users },
  ];

  const getCategoryLabel = (category) => {
    const labels = {
      programming: 'プログラミング',
      design: 'デザイン',
      business: 'ビジネス',
      language: '語学',
      data: 'データサイエンス',
      marketing: 'マーケティング',
      other: 'その他'
    };
    return labels[category] || category;
  };

  const getLevelLabel = (level) => {
    const labels = {
      beginner: '初級',
      intermediate: '中級',
      advanced: '上級'
    };
    return labels[level] || level;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">講師ダッシュボード</h1>
              <p className="text-blue-100">コースパフォーマンスと学生の分析</p>
            </div>
            <button
              onClick={() => navigate('/create-post')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all"
              data-testid="button-create-course"
            >
              <Plus className="w-5 h-5" />
              新しいコース
            </button>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`flex-shrink-0 px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                data-testid={`period-${period.id}`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-md p-6"
            data-testid="stat-students"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">総学生数</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6"
            data-testid="stat-courses"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">総コース数</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6"
            data-testid="stat-revenue"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">総収益</p>
                <p className="text-2xl font-bold text-gray-800">¥{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6"
            data-testid="stat-rating"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">平均評価</p>
                <p className="text-2xl font-bold text-gray-800">{stats.averageRating} / 5.0</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      パフォーマンス指標
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">完了率</span>
                        <span className="font-bold text-green-600">{stats.completionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">総レビュー数</span>
                        <span className="font-bold text-gray-800">{stats.totalReviews}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      実績
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">トップ評価講師</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-600">1000+学生達成</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-4">
                {coursesData.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">まだコースがありません</p>
                    <button
                      onClick={() => navigate('/create-post')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      最初のコースを作成
                    </button>
                  </div>
                ) : (
                  coursesData.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/course/${course.id}`)}
                      data-testid={`course-${course.id}`}
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students}人
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {course.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.lessons}レッスン
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ¥{course.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">収益</div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-course/${course.id}`);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                        data-testid={`button-edit-${course.id}`}
                      >
                        <Edit3 className="w-5 h-5 text-gray-600" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">学生管理</p>
                <p className="text-sm text-gray-500">
                  総学生数: {stats.totalStudents}人
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigationWithCreator active="creator" />
    </div>
  );
};

export default CreatorDashboard;
