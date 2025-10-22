import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  Save,
  User,
  Mail,
  Globe,
  MapPin,
  CheckCircle,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    email: '',
    website: '',
    location: '',
    expertise: '',
    yearsOfExperience: '',
    isCreator: false
  });

  const [avatar, setAvatar] = useState('/logo-school.jpg');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=200&fit=crop');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            name: userData.displayName || userData.name || '',
            username: userData.username || '',
            bio: userData.bio || '',
            email: userData.email || currentUser.email || '',
            website: userData.website || '',
            location: userData.location || '',
            expertise: userData.expertise || '',
            yearsOfExperience: userData.yearsOfExperience || '',
            isCreator: userData.isCreator || false
          });
          setAvatar(userData.photoURL || userData.avatar || '/logo-school.jpg');
          setCoverImage(userData.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=200&fit=crop');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      await setDoc(userDocRef, {
        displayName: formData.name,
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        email: formData.email,
        website: formData.website,
        location: formData.location,
        expertise: formData.expertise,
        yearsOfExperience: formData.yearsOfExperience,
        isCreator: formData.isCreator,
        photoURL: avatar,
        avatar: avatar,
        coverImage: coverImage,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate('/account');
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('プロフィールの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

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
                <User className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">プロフィール編集</h1>
                <p className="text-sm text-blue-100">あなたの情報を更新</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="relative h-48 group">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="px-6 py-3 bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                  data-testid="button-upload-cover"
                >
                  カバー画像を変更
                </button>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </div>

            {/* Avatar */}
            <div className="relative px-8 pb-8 -mt-16">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
                  data-testid="button-upload-avatar"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              基本情報
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  お名前 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="山田太郎"
                  data-testid="input-name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ユーザー名
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="yamada_taro"
                  data-testid="input-username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  自己紹介
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="あなたについて教えてください"
                  data-testid="input-bio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="example@email.com"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ウェブサイト
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="https://example.com"
                    data-testid="input-website"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  所在地
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="東京、日本"
                  data-testid="input-location"
                />
              </div>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              講師情報
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <input
                  type="checkbox"
                  name="isCreator"
                  checked={formData.isCreator}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  data-testid="checkbox-instructor"
                />
                <div>
                  <label className="font-semibold text-gray-800">講師として登録</label>
                  <p className="text-sm text-gray-600">コースを作成して知識を共有しましょう</p>
                </div>
              </div>

              {formData.isCreator && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      専門分野
                    </label>
                    <input
                      type="text"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="例: Web開発、データサイエンス"
                      data-testid="input-expertise"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      経験年数
                    </label>
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="5年"
                      data-testid="input-experience"
                    />
                  </div>
                </>
              )}
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
              disabled={isLoading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="button-save"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  保存
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">更新完了！</h3>
            <p className="text-gray-600">プロフィールが正常に更新されました。</p>
          </motion.div>
        </div>
      )}

      <BottomNavigationWithCreator active="account" />
    </div>
  );
};

export default EditProfilePage;
