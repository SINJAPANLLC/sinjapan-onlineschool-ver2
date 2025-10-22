import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSendCode = async () => {
    if (!email || !validateEmail(email)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(2);
      setCountdown(600);
      setAttempts(0);
    } catch (err) {
      setError('認証メールの送信に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('6桁の認証コードを入力してください');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (verificationCode === '123456') {
        setStep(3);
      } else {
        setAttempts(prev => prev + 1);
        if (attempts >= 2) {
          setError('認証回数が上限に達しました。');
          setStep(1);
          setEmail('');
          setVerificationCode('');
          setAttempts(0);
        } else {
          setError(`認証コードが正しくありません。残り${3 - attempts - 1}回`);
          setVerificationCode('');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(600);
      setAttempts(0);
      setVerificationCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 bg-gradient-to-r from-pink-500 to-pink-600 border-b border-pink-300 p-6 flex items-center z-10 shadow-lg">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="text-white mr-4 p-2 hover:bg-white/20 rounded-full" data-testid="button-back">
          <ArrowLeft size={24} />
        </motion.button>
        <div className="flex items-center">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <Mail className="w-7 h-7 text-white mr-3" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">メールアドレス認証</h1>
        </div>
      </motion.div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-pink-200 shadow-lg">
                  <Mail className="w-10 h-10 text-pink-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">メールアドレスを入力</h2>
                <p className="text-gray-600 leading-relaxed">認証用のメールを送信するために、メールアドレスを入力してください</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">メールアドレス</label>
                  <input type="email" value={email} onChange={handleEmailChange} placeholder="example@email.com" className="w-full px-5 py-4 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg font-semibold shadow-sm" data-testid="input-email" />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200">
                    <AlertCircle className="w-6 h-6" />
                    <span className="text-sm font-bold">{error}</span>
                  </motion.div>
                )}

                <motion.button onClick={handleSendCode} disabled={isLoading || !email || !validateEmail(email)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 transition-all flex items-center justify-center space-x-3 shadow-lg" data-testid="button-send-code">
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>送信中...</span>
                    </>
                  ) : (
                    <>
                      <span>認証メールを送信</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-200 shadow-lg">
                  <Shield className="w-10 h-10 text-blue-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">認証コードを入力</h2>
                <p className="text-gray-600 mb-3">{email} に送信された6桁のコードを入力</p>
                {countdown > 0 && (
                  <p className="text-sm font-bold text-pink-600 flex items-center justify-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>残り {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">認証コード</label>
                  <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" className="w-full px-5 py-4 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 text-lg text-center tracking-widest font-bold shadow-sm" data-testid="input-code" />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200">
                    <AlertCircle className="w-6 h-6" />
                    <span className="text-sm font-bold">{error}</span>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <motion.button onClick={handleVerifyCode} disabled={isLoading || !verificationCode || verificationCode.length !== 6} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 transition-all flex items-center justify-center space-x-3 shadow-lg" data-testid="button-verify">
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>認証中...</span>
                      </>
                    ) : (
                      <>
                        <span>認証する</span>
                        <CheckCircle className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>

                  <motion.button onClick={handleResendCode} disabled={countdown > 0 || isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
                    <RotateCcw className="w-5 h-5" />
                    <span>{countdown > 0 ? `再送信 (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})` : '認証メールを再送信'}</span>
                  </motion.button>

                  <motion.button onClick={() => window.open('mailto:', '_blank')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-blue-100 text-blue-700 py-4 rounded-2xl font-bold hover:bg-blue-200 transition-all flex items-center justify-center space-x-2">
                    <ExternalLink className="w-5 h-5" />
                    <span>メールアプリを開く</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
              <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }} transition={{ duration: 1 }} className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-300 shadow-2xl">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">認証完了！</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                メールアドレスの認証が完了しました。<br />
                {email} が認証済みとして登録されました。
              </p>

              <motion.button onClick={() => navigate('/account')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all shadow-lg">
                アカウントに戻る
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-200 rounded-2xl p-6 relative overflow-hidden">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
          <div className="flex items-start space-x-4 relative z-10">
            <Sparkles className="w-6 h-6 text-pink-600 mt-1" />
            <div>
              <h4 className="font-bold text-pink-900 mb-2 text-lg">メールアドレス認証について</h4>
              <ul className="text-base text-pink-800 space-y-2">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" />認証コードは10分間有効です</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" />認証は3回まで試行できます</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" />迷惑メールフォルダもご確認ください</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNavigationWithCreator active="account" />
    </div>
  );
};

export default EmailVerificationPage;
