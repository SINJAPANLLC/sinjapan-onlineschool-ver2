import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Trophy, GraduationCap, Star, ArrowRight, Globe, Clock, Award } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/signup');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const features = [
        {
            icon: BookOpen,
            title: 'オンライン学習',
            description: 'いつでもどこでも学習できる充実のコンテンツ'
        },
        {
            icon: Users,
            title: 'プロ講師陣',
            description: '経験豊富な講師による質の高い授業'
        },
        {
            icon: Trophy,
            title: '実績多数',
            description: '多くの生徒が目標を達成しています'
        },
        {
            icon: Clock,
            title: '24時間対応',
            description: 'いつでも質問・相談できるサポート体制'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <header className="w-full bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                SIN JAPAN ONLINE SCHOOL
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogin}
                                className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors"
                                data-testid="button-login"
                            >
                                ログイン
                            </button>
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                                data-testid="button-signup"
                            >
                                無料で始める
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
                        >
                            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                あなたの未来を
                            </span>
                            <br />
                            <span className="text-gray-800">
                                一緒に創りましょう
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                            data-testid="text-hero-description"
                        >
                            SIN JAPAN ONLINE SCHOOLで、あなたの可能性を最大限に引き出しましょう。
                            プロ講師による質の高い授業で、確実にスキルアップできます。
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                                data-testid="button-cta-primary"
                            >
                                今すぐ無料で始める
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => window.scrollTo({ top: document.getElementById('features').offsetTop, behavior: 'smooth' })}
                                className="bg-white text-blue-600 border-2 border-blue-500 font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                                data-testid="button-cta-secondary"
                            >
                                詳しく見る
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                        >
                            <div className="text-center" data-testid="stat-students">
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    10,000+
                                </div>
                                <div className="text-gray-600 mt-2">受講生</div>
                            </div>
                            <div className="text-center" data-testid="stat-courses">
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    500+
                                </div>
                                <div className="text-gray-600 mt-2">コース</div>
                            </div>
                            <div className="text-center" data-testid="stat-satisfaction">
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    98%
                                </div>
                                <div className="text-gray-600 mt-2">満足度</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            選ばれる理由
                        </h2>
                        <p className="text-xl text-gray-600">
                            SIN JAPAN ONLINE SCHOOLの特徴
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
                                data-testid={`feature-card-${index}`}
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">
                            今すぐ始めましょう
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            無料トライアルで、全てのコンテンツを体験できます
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="bg-white text-blue-600 font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
                            data-testid="button-cta-footer"
                        >
                            無料で始める
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    SIN JAPAN ONLINE SCHOOL
                                </span>
                            </div>
                            <p className="text-sm text-gray-600" data-testid="text-copyright">
                                © 2025 SIN JAPAN ONLINE SCHOOL. All rights reserved.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 text-sm">
                            <button 
                                onClick={() => navigate('/terms')}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-testid="link-terms"
                            >
                                利用規約
                            </button>
                            <button 
                                onClick={() => navigate('/privacy')}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-testid="link-privacy"
                            >
                                プライバシーポリシー
                            </button>
                            <button 
                                onClick={() => navigate('/legal')}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-testid="link-legal"
                            >
                                特定商取引法に基づく表記
                            </button>
                            <button 
                                onClick={() => navigate('/guidelines')}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-testid="link-guidelines"
                            >
                                コンテンツガイドライン
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
