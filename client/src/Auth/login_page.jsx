import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, GraduationCap, BookOpen, Users, Trophy } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useTranslation } from 'react-i18next';

export default function MyFansLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, text: '500+のコース' },
    { icon: Users, text: '10,000+の学習者' },
    { icon: Trophy, text: '98%の満足度' }
  ];

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName || 'ユーザー',
          email: user.email,
          createdAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          isOnline: true,
          provider: 'google',
          role: 'student'
        });
      } else {
        await setDoc(userRef, {
          lastSeen: new Date().toISOString(),
          isOnline: true
        }, { merge: true });
      }
      
      navigate("/home");
      
    } catch (error) {
      console.error("Googleログインエラー:", error);
      
      let errorMessage = "Googleログインに失敗しました";
      
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google認証が有効になっていません。";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "ログインがキャンセルされました";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "ポップアップがブロックされました。";
      }
      
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetError('メールアドレスを入力してください');
      return;
    }

    setIsResetting(true);
    setResetError('');
    setResetMessage('');

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('パスワードリセット用のメールを送信しました。');
      setResetEmail('');
      
      setTimeout(() => {
        setShowResetModal(false);
        setResetMessage('');
      }, 3000);
    } catch (err) {
      let errorMessage = "パスワードリセットに失敗しました";
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = "このメールアドレスで登録されたアカウントがありません";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "メールアドレスの形式が正しくありません";
      }
      
      setResetError(errorMessage);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogin = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      try {
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            isOnline: true,
            lastSeen: new Date().toISOString()
          });
        } else {
          await setDoc(userDocRef, {
            displayName: userCredential.user.displayName || 'ユーザー',
            email: userCredential.user.email,
            createdAt: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            isOnline: true,
            role: 'student'
          });
        }
      } catch (firestoreError) {
        console.log('Error updating user status:', firestoreError);
      }

      navigate("/home");
    } catch (err) {
      let errorMessage = "ログインに失敗しました";
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = "このメールアドレスで登録されたアカウントがありません";
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = "パスワードが正しくありません";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "メールアドレスの形式が正しくありません";
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = "このアカウントは無効になっています";
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = "メールアドレスまたはパスワードが正しくありません";
      }
      
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
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
            <p className="text-gray-600">学習を始めましょう</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
                  placeholder="••••••••"
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-gray-600">ログイン状態を保持</span>
              </label>
              <button
                onClick={() => setShowResetModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
                data-testid="button-forgot-password"
              >
                パスワードを忘れた方
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={isVerifying || !email || !password}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-login"
            >
              {isVerifying ? '認証中...' : 'ログイン'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">または</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
              data-testid="button-google-login"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? '認証中...' : 'Googleでログイン'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              アカウントをお持ちでない方は{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
                data-testid="link-signup"
              >
                新規登録
              </button>
            </p>
          </motion.div>
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
            オンライン学習で
            <br />
            未来を切り開く
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            質の高い授業と充実したサポートで、あなたの学習をサポートします
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
        </motion.div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">パスワードリセット</h3>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetError('');
                  setResetMessage('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                data-testid="button-close-reset-modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {resetMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
                {resetMessage}
              </div>
            )}

            {resetError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                {resetError}
              </div>
            )}

            <p className="text-gray-600 mb-4">
              パスワードリセット用のメールを送信します。
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  data-testid="input-reset-email"
                />
              </div>
            </div>

            <button
              onClick={handlePasswordReset}
              disabled={isResetting}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              data-testid="button-send-reset"
            >
              {isResetting ? '送信中...' : 'リセットメールを送信'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
