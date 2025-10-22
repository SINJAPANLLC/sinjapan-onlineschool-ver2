import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  GraduationCap,
  Heart,
  Share2,
  Lock,
  CheckCircle,
  ChevronRight,
  Award,
  TrendingUp,
  FileText,
  Video
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadCourseData();
  }, [id, currentUser]);

  const loadCourseData = async () => {
    try {
      setLoading(true);

      // Load course from Firestore (posts collection)
      const courseDoc = await getDoc(doc(db, 'posts', id));
      
      if (!courseDoc.exists()) {
        console.error('Course not found');
        setLoading(false);
        return;
      }

      const courseData = courseDoc.data();
      
      // Format course data
      const formattedCourse = {
        id: courseDoc.id,
        title: courseData.title || 'Untitled Course',
        description: courseData.description || '',
        thumbnail: courseData.thumbnailUrl || courseData.imageUrl || '/logo-school.jpg',
        instructor: courseData.instructorName || courseData.username || 'Unknown',
        instructorId: courseData.userId || courseData.creatorId || '',
        category: courseData.category || 'その他',
        level: courseData.level || '初級',
        duration: courseData.duration || '0時間',
        rating: courseData.rating || 4.5,
        students: courseData.studentsCount || 0,
        price: courseData.price || 0,
        videoUrl: courseData.videoUrl || '',
        createdAt: courseData.createdAt?.toDate() || new Date(),
        tags: courseData.tags || [],
        requirements: courseData.requirements || [],
        whatYouWillLearn: courseData.whatYouWillLearn || []
      };

      setCourse(formattedCourse);

      // Load instructor data
      if (formattedCourse.instructorId) {
        const instructorDoc = await getDoc(doc(db, 'users', formattedCourse.instructorId));
        if (instructorDoc.exists()) {
          setInstructor({
            id: instructorDoc.id,
            ...instructorDoc.data()
          });
        }
      }

      // Check if user is enrolled
      if (currentUser) {
        const enrollmentDoc = await getDoc(doc(db, 'users', currentUser.uid, 'enrolledCourses', id));
        setIsEnrolled(enrollmentDoc.exists());
        if (enrollmentDoc.exists()) {
          setProgress(enrollmentDoc.data().progress || 0);
        }
      }

      // Load course lessons (from subcollection or placeholder)
      setLessons([
        { id: 1, title: 'コース概要と学習方法', duration: '10:30', isPreview: true, completed: false },
        { id: 2, title: '基礎知識の習得', duration: '25:45', isPreview: false, completed: false },
        { id: 3, title: '実践演習', duration: '35:20', isPreview: false, completed: false },
        { id: 4, title: '応用テクニック', duration: '28:15', isPreview: false, completed: false },
        { id: 5, title: '最終プロジェクト', duration: '45:00', isPreview: false, completed: false }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error loading course:', error);
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (course.price > 0) {
      // Navigate to payment/subscription page
      navigate(`/profile/${course.instructorId}`);
    } else {
      // Free course - enroll directly
      enrollInCourse();
    }
  };

  const enrollInCourse = async () => {
    // Implementation for direct enrollment
    alert('受講登録が完了しました！');
    setIsEnrolled(true);
  };

  const handleLessonClick = (lesson) => {
    if (!isEnrolled && !lesson.isPreview) {
      alert('このレッスンを視聴するには、コースに登録する必要があります。');
      return;
    }

    if (course.videoUrl) {
      navigate(`/video/${course.id}`);
    } else {
      alert('このレッスンの動画はまだ利用できません。');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'プログラミング': 'from-blue-500 to-blue-600',
      '語学': 'from-green-500 to-green-600',
      'ビジネス': 'from-purple-500 to-purple-600',
      'デザイン': 'from-pink-500 to-pink-600',
      'AI/機械学習': 'from-indigo-500 to-indigo-600',
      'データ分析': 'from-yellow-500 to-yellow-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">コースが見つかりません</h2>
          <button
            onClick={() => navigate('/home')}
            className="text-blue-600 hover:underline"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>戻る</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8 py-8">
            {/* Course Info */}
            <div>
              <div className={`inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4`}>
                {course.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-course-title">
                {course.title}
              </h1>
              <p className="text-white/90 text-lg mb-6">{course.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.students}人の受講生</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.level}</span>
                </div>
              </div>

              {/* Instructor */}
              <div
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all"
                onClick={() => navigate(`/profile/${course.instructorId}`)}
                data-testid="button-instructor"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {course.instructor[0]}
                </div>
                <div>
                  <p className="text-sm text-white/70">講師</p>
                  <p className="font-semibold">{course.instructor}</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto" />
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLessonClick({ isPreview: true })}
                    className="bg-white/90 backdrop-blur-sm text-blue-600 rounded-full p-6 shadow-xl hover:bg-white transition-all"
                    data-testid="button-play-preview"
                  >
                    <Play className="w-8 h-8 fill-current" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white rounded-2xl shadow-xl p-6"
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
                      <p className="text-3xl font-bold text-gray-800 mb-2">
                        {course.price > 0 ? `¥${course.price.toLocaleString()}` : '無料'}
                      </p>
                      {course.price > 0 && (
                        <p className="text-sm text-gray-600">講師のサブスクリプションで受講可能</p>
                      )}
                    </div>
                    <button
                      onClick={handleEnroll}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all mb-3"
                      data-testid="button-enroll"
                    >
                      {course.price > 0 ? 'サブスクリプションで受講' : 'コースに登録'}
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
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* What You'll Learn */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  学習内容
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {(course.whatYouWillLearn.length > 0 ? course.whatYouWillLearn : [
                    '基礎から応用まで段階的に学習',
                    '実践的なプロジェクト演習',
                    '業界標準のベストプラクティス',
                    'プロフェッショナルレベルのスキル習得'
                  ]).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Description */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">コースの詳細</h2>
                <p className="text-gray-700 leading-relaxed">
                  {course.description || 'このコースでは、実践的なスキルを身につけることができます。初心者から上級者まで、段階的に学習を進めることができるよう設計されています。'}
                </p>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">必要な前提知識</h2>
                <ul className="space-y-2">
                  {(course.requirements.length > 0 ? course.requirements : [
                    '基本的なPC操作ができること',
                    '学習意欲があること'
                  ]).map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                      <p className="text-gray-700">{req}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'curriculum' && (
            <motion.div
              key="curriculum"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">カリキュラム</h2>
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleLessonClick(lesson)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isEnrolled || lesson.isPreview
                        ? 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                    data-testid={`lesson-${lesson.id}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.completed
                        ? 'bg-green-500 text-white'
                        : isEnrolled || lesson.isPreview
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : isEnrolled || lesson.isPreview ? (
                        <Play className="w-4 h-4 fill-current" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.duration}</p>
                    </div>
                    {lesson.isPreview && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                        プレビュー
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'instructor' && instructor && (
            <motion.div
              key="instructor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                  {course.instructor[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.instructor}</h2>
                  <p className="text-gray-600">プロフェッショナル講師</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                {instructor.bio || '経験豊富な講師が、実践的なスキルを丁寧に指導します。'}
              </p>
              <button
                onClick={() => navigate(`/profile/${course.instructorId}`)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                data-testid="button-view-profile"
              >
                講師のプロフィールを見る
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavigationWithCreator active="home" />
    </div>
  );
};

export default CourseDetailPage;
