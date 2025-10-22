import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ArrowLeft,
  Upload,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Video,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isCreator, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'programming',
    level: 'beginner',
    duration: '',
    price: '',
    language: 'ja',
  });

  const [lessons, setLessons] = useState([
    { title: '', duration: '', description: '', videoUrl: '' }
  ]);

  const [requirements, setRequirements] = useState(['']);
  const [learningObjectives, setLearningObjectives] = useState(['']);
  const [tags, setTags] = useState(['']);

  const [thumbnail, setThumbnail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'programming', label: 'プログラミング' },
    { id: 'design', label: 'デザイン' },
    { id: 'business', label: 'ビジネス' },
    { id: 'language', label: '語学' },
    { id: 'data', label: 'データサイエンス' },
    { id: 'marketing', label: 'マーケティング' },
    { id: 'other', label: 'その他' },
  ];

  const levels = [
    { id: 'beginner', label: '初級' },
    { id: 'intermediate', label: '中級' },
    { id: 'advanced', label: '上級' },
  ];

  useEffect(() => {
    const checkInstructorStatus = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // 後方互換性：isCreatorとisInstructor両方をチェック
          setIsInstructor(userData.isCreator || userData.isInstructor || false);
        }
      } catch (error) {
        console.error('講師ステータスの取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    checkInstructorStatus();
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', duration: '', description: '', videoUrl: '' }]);
  };

  const removeLesson = (index) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  const handleArrayChange = (index, value, arr, setArr) => {
    const newArr = [...arr];
    newArr[index] = value;
    setArr(newArr);
  };

  const addArrayItem = (arr, setArr) => {
    setArr([...arr, '']);
  };

  const removeArrayItem = (index, arr, setArr) => {
    if (arr.length > 1) {
      setArr(arr.filter((_, i) => i !== index));
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'コース名を入力してください';
    if (!formData.description.trim()) newErrors.description = '説明を入力してください';
    if (!formData.duration) newErrors.duration = '総学習時間を入力してください';
    if (!formData.price) newErrors.price = '価格を入力してください';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const courseData = {
        ...formData,
        lessons: lessons.filter(l => l.title.trim()),
        requirements: requirements.filter(r => r.trim()),
        learningObjectives: learningObjectives.filter(l => l.trim()),
        tags: tags.filter(t => t.trim()),
        creatorId: currentUser.uid,
        instructorName: currentUser.displayName || 'Unknown',
        thumbnail: thumbnail || '/logo-school.jpg',
        students: 0,
        rating: 0,
        reviews: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'courses'), courseData);
      
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/creator-dashboard');
      }, 2000);
    } catch (error) {
      console.error('コース作成エラー:', error);
      alert('コースの作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
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

  if (!isCreator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">アクセス制限</h2>
          <p className="text-gray-600 mb-6">
            コースを作成するには講師登録が必要です。
          </p>
          <button
            onClick={() => navigate('/account')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            data-testid="button-go-account"
          >
            アカウントページへ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">新しいコースを作成</h1>
                <p className="text-sm text-blue-100">学生に知識を共有しましょう</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              基本情報
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  コース名 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${errors.title ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-500`}
                  placeholder="例: JavaScript完全マスターコース"
                  data-testid="input-title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  説明 *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border-2 ${errors.description ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-500`}
                  placeholder="このコースで学べる内容を詳しく説明してください"
                  data-testid="input-description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    カテゴリー
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    data-testid="select-category"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    レベル
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    data-testid="select-level"
                  >
                    {levels.map(lvl => (
                      <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    総学習時間 *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 ${errors.duration ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-500`}
                    placeholder="例: 24時間"
                    data-testid="input-duration"
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    価格（円） *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 ${errors.price ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-500`}
                    placeholder="12800"
                    data-testid="input-price"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  サムネイル画像
                </label>
                <div className="flex items-center gap-4">
                  {thumbnail && (
                    <img src={thumbnail} alt="Thumbnail" className="w-32 h-32 object-cover rounded-xl" />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">クリックして画像をアップロード</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      data-testid="input-thumbnail"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Video className="w-6 h-6 text-blue-600" />
                レッスン
              </h2>
              <button
                type="button"
                onClick={addLesson}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-all"
                data-testid="button-add-lesson"
              >
                <Plus className="w-4 h-4" />
                追加
              </button>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-700">レッスン {index + 1}</h3>
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="text-red-500 hover:text-red-700"
                        data-testid={`button-remove-lesson-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="レッスンタイトル"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      data-testid={`input-lesson-title-${index}`}
                    />
                    <input
                      type="text"
                      placeholder="時間（例: 15分）"
                      value={lesson.duration}
                      onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      data-testid={`input-lesson-duration-${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">学習目標</h2>
              <button
                type="button"
                onClick={() => addArrayItem(learningObjectives, setLearningObjectives)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-all"
                data-testid="button-add-objective"
              >
                <Plus className="w-4 h-4" />
                追加
              </button>
            </div>
            
            <div className="space-y-2">
              {learningObjectives.map((obj, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="このコースで学べること"
                    value={obj}
                    onChange={(e) => handleArrayChange(index, e.target.value, learningObjectives, setLearningObjectives)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    data-testid={`input-objective-${index}`}
                  />
                  {learningObjectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, learningObjectives, setLearningObjectives)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              data-testid="button-cancel"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  作成中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  コースを作成
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">コース作成完了！</h3>
            <p className="text-gray-600">
              コースが正常に作成されました。
            </p>
          </motion.div>
        </div>
      )}

      <BottomNavigationWithCreator active="creator" />
    </div>
  );
};

export default CreatePostPage;
