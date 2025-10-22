import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap,
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Upload,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const RegisterCreatorPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: 基本情報
    fullName: '',
    email: currentUser?.email || '',
    phone: '',
    
    // Step 2: 講師情報
    expertise: [],
    qualifications: '',
    teachingExperience: '',
    
    // Step 3: 教える内容
    subjects: [],
    coursePlan: '',
    teachingStyle: '',
    
    // Step 4: 自己紹介
    bio: '',
    motivation: '',
    
    // 同意
    agreedToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // 専門分野の選択肢
  const expertiseOptions = [
    { value: 'programming', label: 'プログラミング' },
    { value: 'language', label: '語学' },
    { value: 'business', label: 'ビジネス' },
    { value: 'design', label: 'デザイン' },
    { value: 'marketing', label: 'マーケティング' },
    { value: 'data-science', label: 'データサイエンス' },
    { value: 'music', label: '音楽' },
    { value: 'art', label: 'アート' },
    { value: 'other', label: 'その他' }
  ];

  // 教える科目の選択肢
  const subjectOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'english', label: '英語' },
    { value: 'japanese', label: '日本語' },
    { value: 'web-design', label: 'Webデザイン' },
    { value: 'photography', label: '写真撮影' },
    { value: 'video-editing', label: '動画編集' },
    { value: 'business-strategy', label: 'ビジネス戦略' },
    { value: 'other', label: 'その他' }
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // 既に講師登録済みかチェック
    const checkInstructorStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isCreator || userData.isInstructor) {
            alert('既に講師として登録済みです');
            navigate('/creator-dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking instructor status:', error);
      }
    };

    checkInstructorStatus();
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = '氏名を入力してください';
        if (!formData.email.trim()) newErrors.email = 'メールアドレスを入力してください';
        if (!formData.phone.trim()) newErrors.phone = '電話番号を入力してください';
        else if (!/^[0-9-]+$/.test(formData.phone)) newErrors.phone = '正しい電話番号を入力してください';
        break;

      case 2:
        if (formData.expertise.length === 0) newErrors.expertise = '専門分野を選択してください';
        if (!formData.qualifications.trim()) newErrors.qualifications = '資格・経歴を入力してください';
        if (!formData.teachingExperience.trim()) newErrors.teachingExperience = '指導経験を入力してください';
        break;

      case 3:
        if (formData.subjects.length === 0) newErrors.subjects = '教える科目を選択してください';
        if (!formData.coursePlan.trim()) newErrors.coursePlan = 'コース計画を入力してください';
        if (!formData.teachingStyle.trim()) newErrors.teachingStyle = '指導スタイルを入力してください';
        break;

      case 4:
        if (!formData.bio.trim()) newErrors.bio = '自己紹介を入力してください';
        if (!formData.motivation.trim()) newErrors.motivation = '講師になる理由を入力してください';
        if (!formData.agreedToTerms) newErrors.agreedToTerms = '利用規約に同意してください';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/account');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        isCreator: true,
        isInstructor: true,
        instructorProfile: {
          fullName: formData.fullName,
          phone: formData.phone,
          expertise: formData.expertise,
          qualifications: formData.qualifications,
          teachingExperience: formData.teachingExperience,
          subjects: formData.subjects,
          coursePlan: formData.coursePlan,
          teachingStyle: formData.teachingStyle,
          bio: formData.bio,
          motivation: formData.motivation,
          registeredAt: serverTimestamp(),
          status: 'pending'
        }
      });

      alert('講師登録が完了しました！審査結果をお待ちください。');
      navigate('/creator-dashboard');
    } catch (error) {
      console.error('Error registering instructor:', error);
      alert('登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, label: '基本情報' },
    { number: 2, label: '講師情報' },
    { number: 3, label: '教える内容' },
    { number: 4, label: '確認' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-8 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">講師登録</h1>
                <p className="text-blue-100">SIN JAPAN ONLINE SCHOOL</p>
              </div>
            </div>
            <p className="text-blue-100 text-lg">あなたの知識とスキルを共有しましょう</p>
          </motion.div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    animate={{
                      scale: currentStep === step.number ? 1.1 : 1,
                      backgroundColor: currentStep >= step.number ? '#3b82f6' : '#e5e7eb'
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 shadow-lg"
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </motion.div>
                  <span className={`text-sm font-semibold text-center ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded transition-colors ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">基本情報</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    氏名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="山田 太郎"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 bg-gray-50 ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                    readOnly
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="090-1234-5678"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">講師情報</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    専門分野 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {expertiseOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleArrayToggle('expertise', option.value)}
                        className={`p-3 border-2 rounded-xl font-medium transition-all ${
                          formData.expertise.includes(option.value)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {errors.expertise && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.expertise}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Award className="inline w-4 h-4 mr-1" />
                    資格・経歴 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="qualifications"
                    placeholder="保有している資格、学歴、職歴などを記載してください"
                    value={formData.qualifications}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
                      errors.qualifications ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.qualifications && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.qualifications}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="inline w-4 h-4 mr-1" />
                    指導経験 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="teachingExperience"
                    placeholder="これまでの指導経験について教えてください"
                    value={formData.teachingExperience}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
                      errors.teachingExperience ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.teachingExperience && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.teachingExperience}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">教える内容</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    教える科目 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjectOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleArrayToggle('subjects', option.value)}
                        className={`p-3 border-2 rounded-xl font-medium transition-all ${
                          formData.subjects.includes(option.value)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {errors.subjects && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subjects}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <BookOpen className="inline w-4 h-4 mr-1" />
                    コース計画 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="coursePlan"
                    placeholder="どのようなコースを提供する予定ですか？"
                    value={formData.coursePlan}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
                      errors.coursePlan ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.coursePlan && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.coursePlan}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    指導スタイル <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="teachingStyle"
                    placeholder="あなたの指導スタイルや特徴を教えてください"
                    value={formData.teachingStyle}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
                      errors.teachingStyle ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.teachingStyle && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.teachingStyle}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">自己紹介と確認</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    自己紹介 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    placeholder="学生に向けて自己紹介をしてください"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
                      errors.bio ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.bio && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.bio}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="inline w-4 h-4 mr-1" />
                    講師になる理由 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    placeholder="なぜ講師として教えたいと思いましたか？"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
                      errors.motivation ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.motivation && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.motivation}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      <a href="/terms" target="_blank" className="text-blue-600 hover:underline font-semibold">利用規約</a>、
                      <a href="/privacy" target="_blank" className="text-blue-600 hover:underline font-semibold">プライバシーポリシー</a>、
                      <a href="/guidelines" target="_blank" className="text-blue-600 hover:underline font-semibold">講師ガイドライン</a>
                      に同意します <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.agreedToTerms && (
                    <p className="text-red-600 text-sm mt-2 ml-8 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.agreedToTerms}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStep === 1 ? 'キャンセル' : '戻る'}
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              data-testid="button-next"
            >
              次へ
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-700 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="button-submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  登録中...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  登録を完了
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterCreatorPage;
