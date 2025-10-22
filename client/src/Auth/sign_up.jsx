import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, BookOpen, Users, Trophy, Check } from 'lucide-react';
import { useNavigate } from "react-router-dom"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function MyFansSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const navigate = useNavigate(); 

  const features = [
    { icon: BookOpen, text: '500+のコース' },
    { icon: Users, text: '10,000+の学習者' },
    { icon: Trophy, text: '98%の満足度' }
  ];

  const benefits = [
    '無料トライアル期間付き',
    'すべてのコースへのアクセス',
    '修了証明書の発行',
    '24時間いつでも学習可能'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError("利用規約に同意してください");
      return;
    }
    
    setError("");
    setIsVerifying(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: name,
        email: email,
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        isOnline: true,
        role: 'student',
        enrolledCourses: [],
        completedCourses: []
      });

      navigate("/home");

    } catch (err) {
      let errorMessage = "登録に失敗しました";
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "このメールアドレスは既に使用されています";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "メールアドレスの形式が正しくありません";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "パスワードは6文字以上で設定してください";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "ネットワークエラーが発生しました";
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = "メール/パスワードでの登録が無効になっています";
      }
      
      setError(errorMessage);
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              SIN JAPAN ONLINE SCHOOL
            </h1>
            <p className="text-gray-600">新しい学びを始めましょう</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                data-testid="error-message"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                お名前
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="山田太郎"
                  required
                  data-testid="input-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="6文字以上"
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">6文字以上で設定してください</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-blue-900 mb-2">登録すると以下の特典が受けられます：</p>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-blue-800">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                data-testid="checkbox-terms"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/terms');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  利用規約
                </button>
                、
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/privacy');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  プライバシーポリシー
                </button>
                に同意します
              </span>
            </label>

            <button
              type="submit"
              disabled={isVerifying || !agreedToTerms}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-signup"
            >
              {isVerifying ? '登録中...' : '無料で始める'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              すでにアカウントをお持ちの方は{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
                data-testid="link-login"
              >
                ログイン
              </button>
            </p>
          </motion.form>
        </div>
      </div>

      {/* Right Side - Info Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-md"
        >
          <h2 className="text-4xl font-bold mb-6">
            今すぐ学習を
            <br />
            スタート
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            プロ講師による質の高い授業で、確実にスキルアップ。あなたの目標を実現しましょう。
          </p>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-semibold">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <p className="font-semibold">今なら</p>
                <p className="text-sm text-blue-100">7日間無料トライアル</p>
              </div>
            </div>
            <p className="text-sm text-blue-100">
              すべてのコースに無制限アクセス可能
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
