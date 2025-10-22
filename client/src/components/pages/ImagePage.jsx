import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Heart,
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Lock,
  GraduationCap,
  FileText,
  Award,
  TrendingUp
} from 'lucide-react';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

const ImagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const courseDoc = await getDoc(doc(db, 'courses', id));
        
        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          setCourse({
            id: courseDoc.id,
            title: courseData.title || 'Untitled Course',
            description: courseData.description || '',
            thumbnail: courseData.thumbnail || courseData.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
            instructor: courseData.instructorName || courseData.username || 'Unknown',
            instructorId: courseData.creatorId || '',
            duration: courseData.duration || '0時間',
            students: courseData.students || 0,
            rating: courseData.rating || 0,
            reviews: courseData.reviews || 0,
            category: courseData.category || 'other',
            level: courseData.level || 'beginner',
            lessons: courseData.lessons || [],
            requirements: courseData.requirements || [],
            learningObjectives: courseData.learningObjectives || [],
            tags: courseData.tags || [],
            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt
          });
        } else {
          console.log('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (course?.instructorId) {
      navigate(`/profile/${course.instructorId}`);
    }
  };

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

  const getLevelColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700',
      advanced: 'bg-purple-100 text-purple-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">コースが見つかりません</h2>
          <button
            onClick={() => navigate('/feed')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            コースカタログに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              data-testid="button-back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">コース詳細</h1>
            <button
              onClick={() => {}}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              data-testid="button-share"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Course Hero */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 md:h-96 object-cover"
                data-testid="img-course-thumbnail"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(course.level)}`}>
                  {getLevelLabel(course.level)}
                </span>
              </div>
            </div>

            {/* Course Info */}
            <div className="p-6">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-3">
                  {getCategoryLabel(course.category)}
                </span>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {course.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  {course.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{course.students}人の学生</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">{course.rating} ({course.reviews}件)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{course.lessons.length}レッスン</span>
                </div>
              </div>

              {/* Instructor */}
              <div
                onClick={() => navigate(`/profile/${course.instructorId}`)}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">講師</p>
                  <p className="font-semibold text-gray-800">{course.instructor}</p>
                </div>
              </div>

              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100"
              >
                {isEnrolled ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">学習進捗</h3>
                      <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <button
                      onClick={() => navigate(`/video/${course.id}`)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                      data-testid="button-continue-learning"
                    >
                      学習を続ける
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-2">このコースは</p>
                      <p className="text-xl font-bold text-gray-800 mb-2">講師のサブスクリプションで受講可能</p>
                      <p className="text-sm text-gray-600">講師プロフィールから購読してください</p>
                    </div>
                    <button
                      onClick={handleEnroll}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all mb-3"
                      data-testid="button-view-instructor"
                    >
                      講師プロフィールを見る
                    </button>
                    <div className="flex gap-2">
                      <button className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5" />
                        保存
                      </button>
                      <button className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <Share2 className="w-5 h-5" />
                        共有
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {[
            { id: 'overview', label: '概要', icon: FileText },
            { id: 'curriculum', label: 'カリキュラム', icon: BookOpen },
            { id: 'instructor', label: '講師', icon: GraduationCap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  学習目標
                </h3>
                <ul className="space-y-2">
                  {course.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                  {course.learningObjectives.length === 0 && (
                    <li className="text-gray-500">学習目標が設定されていません</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  必要な前提知識
                </h3>
                <ul className="space-y-2">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                  {course.requirements.length === 0 && (
                    <li className="text-gray-500">特に必要な前提知識はありません</li>
                  )}
                </ul>
              </div>

              {course.tags.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                カリキュラム ({course.lessons.length}レッスン)
              </h3>
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{lesson.title}</h4>
                        {lesson.description && (
                          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {lesson.duration && (
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lesson.duration}
                        </span>
                      )}
                      {!isEnrolled && (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                      {isEnrolled && (
                        <Play className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
                {course.lessons.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>レッスンがまだ追加されていません</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                講師について
              </h3>
              <div
                onClick={() => navigate(`/profile/${course.instructorId}`)}
                className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{course.instructor}</h4>
                  <p className="text-gray-600 mb-4">
                    このコースの講師です。詳細はプロフィールページをご覧ください。
                  </p>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    プロフィールを見る
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNavigationWithCreator active="courses" />
    </div>
  );
};

export default ImagePage;
