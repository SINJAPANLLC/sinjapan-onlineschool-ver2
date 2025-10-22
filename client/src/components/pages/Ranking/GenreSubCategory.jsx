import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BottomNavigationWithCreator from '../../BottomNavigationWithCreator';
import {
    ArrowLeft,
    ChevronRight,
    Info,
    User,
    Play,
    Heart,
    MapPin,
    Shirt,
    Crown,
    Users,
    MessageCircle,
    Star,
    Gamepad2,
    Music,
    Home,
    Dumbbell,
    Camera,
    Mic,
    Video
} from 'lucide-react';

const GenreSubcategoryPage = ({ selectedGenre, onBack, onSubcategorySelect }) => {
    // Information notices at the top
    const navigate = useNavigate();

    const BackTo = () => {
        navigate('/rankingpage');
    }

    const handleSubcategoryClick = (genreName) => {
        navigate(`/genre/${encodeURIComponent(genreName)}`);
    };

    // Genre data with subcategories
    const genreData = {
        appearance: {
            title: 'ビジュアル',
            icon: User,
            subcategories: [
                { name: 'ロリ顔', courses: '97,902 courses' },
                { name: '地味顔', courses: '66,327 courses' },
                { name: 'ギャル', courses: '60,570 courses' },
                { name: 'お姉さん', courses: '24,470 courses' },
                { name: '熟女', courses: '23,472 courses' },
                { name: 'デカ尻', courses: '18,726 courses' },
                { name: '巨乳', courses: '17,467 courses' },
                { name: '貧乳', courses: '16,680 courses' },
                { name: '入れ墨', courses: '13,701 courses' }
            ]
        },
        play: {
            title: 'プレイ',
            icon: Play,
            subcategories: [
                { name: '正常位', courses: '11,804 courses' },
                { name: '騎乗位', courses: '5,576 courses' },
                { name: 'バック', courses: '4,676 courses' },
                { name: '種付けプレス', courses: '3,770 courses' },
                { name: 'フェラチオ', courses: '2,227 courses' },
                { name: 'パイずり', courses: '1,500 courses' },
                { name: '中だし', courses: '1,200 courses' },
                { name: '顔射', courses: '1,000 courses' },
                { name: '言葉責め', courses: '900 courses' },
                { name: 'クンニ', courses: '800 courses' },
                { name: '玩具', courses: '700 courses' },
                { name: '潮吹き（女）', courses: '600 courses' },
                { name: 'アナル', courses: '500 courses' },
                { name: '企画', courses: '400 courses' }
            ]
        },
        situation: {
            title: 'シチュエーション',
            icon: MapPin,
            subcategories: [
                { name: '複数プレイ', courses: '350 courses' },
                { name: '女性優位', courses: '300 courses' },
                { name: '寝取られ', courses: '280 courses' },
                { name: '野外・露出', courses: '250 courses' },
                { name: 'オナニー', courses: '220 courses' },
                { name: 'ハメ撮り', courses: '200 courses' },
                { name: 'コスプレ', courses: '180 courses' },
                { name: '主観', courses: '160 courses' },
                { name: '盗撮', courses: '140 courses' },
                { name: 'レイプ', courses: '120 courses' },
                { name: 'ＧＬ', courses: '100 courses' },
                { name: 'ＢＬ', courses: '90 courses' }
            ]
        },
        abnormal: {
            title: 'アブノーマル',
            icon: Heart,
            subcategories: [
                { name: '緊縛', courses: '80 courses' },
                { name: '浣腸', courses: '70 courses' },
                { name: '調教', courses: '60 courses' },
                { name: '拡張', courses: '50 courses' },
                { name: '殴打', courses: '40 courses' },
                { name: '女装・男の娘', courses: '35 courses' },
                { name: '潮吹き（男）', courses: '30 courses' },
                { name: '尿道', courses: '25 courses' },
                { name: 'その他フェチ', courses: '20 courses' }
            ]
        },
        other: {
            title: 'その他',
            icon: Shirt,
            subcategories: [
                { name: '会いに行ける', courses: '15 courses' },
                { name: 'イベント', courses: '12 courses' },
                { name: 'HowTo', courses: '10 courses' },
                { name: 'ASMR', courses: '8 courses' }
            ]
        }
    };

    // Get current genre data or default
    const currentGenre = genreData[selectedGenre] || genreData.appearance;

    const NoticeItem = ({ notice }) => (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg mb-3"
        >
            <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                    <notice.icon className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm text-blue-800 font-medium">
                    {notice.title}
                </span>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400" />
        </motion.div>
    );

    const SubcategoryItem = ({ subcategory, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSubcategoryClick(subcategory.name)}
            className="relative flex items-center justify-between p-4 bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all duration-200 overflow-hidden group"
        >
            {/* グロウエフェクト */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            
            <div className="flex-1 relative z-10">
                <h3 className="text-base font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1">
                    {subcategory.name}
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                    {subcategory.courses}
                </p>
            </div>
            <motion.div
                whileHover={{ x: 3 }}
                className="relative z-10"
            >
                <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0" strokeWidth={2.5} />
            </motion.div>
        </motion.div>
    );

    return (
        <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: -10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onBack}
                            className="p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-rose-50 rounded-full transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" strokeWidth={2.5} />
                        </motion.button>
                        <div className="flex items-center space-x-2">
                            <motion.div
                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-full"
                            >
                                <currentGenre.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </motion.div>
                            <motion.h1 
                                className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"
                                animate={{ opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                {currentGenre.title}
                            </motion.h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6">
                {/* Notice Section */}
                <div className="mb-6">
                    {notices.map((notice) => (
                        <NoticeItem key={notice.id} notice={notice} />
                    ))}
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-4">
                    {currentGenre.subcategories.map((subcategory, index) => (
                        <SubcategoryItem key={subcategory.name} subcategory={subcategory} index={index} />
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative bg-gradient-to-br from-blue-400 to-blue-600 text-white px-8 py-3.5 rounded-full font-bold shadow-xl overflow-hidden group"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <motion.span
                            className="relative z-10"
                            animate={{ opacity: [0.9, 1, 0.9] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            さらにカテゴリを読み込む
                        </motion.span>
                    </motion.button>
                </div>
            </div>

            {/* Bottom Navigation Placeholder */}
            <div className="h-20"></div>
        </div>
    );
};

// Main component that handles navigation between genre list and subcategory pages
const GenreNavigationSystem = () => {
    const [currentPage, setCurrentPage] = useState('list'); // 'list' or 'subcategory'
    const [selectedGenre, setSelectedGenre] = useState('appearance');
    const { t } = useTranslation();

    // Genre categories for the main list
    const genreCategories = [
        {
            id: 'appearance',
            title: 'ビジュアル',
            description: 'ロリ顔、地味顔、ギャルなど出演者の属性に応じたジャンル',
            icon: User,
            color: 'text-blue-500'
        },
        {
            id: 'play',
            title: 'プレイ',
            description: '騎乗位、フェラチオなどプレイ内容に応じたジャンル',
            icon: Play,
            color: 'text-purple-500'
        },
        {
            id: 'situation',
            title: 'シチュエーション',
            description: '複数プレイ、野外・露出など撮影状況に応じたジャンル',
            icon: MapPin,
            color: 'text-blue-500'
        },
        {
            id: 'abnormal',
            title: 'アブノーマル',
            description: '緊縛、調教など特殊なプレイに応じたジャンル',
            icon: Heart,
            color: 'text-red-500'
        },
        {
            id: 'other',
            title: 'その他',
            description: '会いに行ける、イベントなどその他のジャンル',
            icon: Shirt,
            color: 'text-green-500'
        }
    ];


    const handleGenreSelect = (genreId) => {
        setSelectedGenre(genreId);
        setCurrentPage('subcategory');
    };

    const handleBackToList = () => {
        setCurrentPage('list');
    };

    const handleSubcategorySelect = (subcategory) => {
        console.log('Selected subcategory:', subcategory);
        // Handle subcategory selection here
    };

    if (currentPage === 'subcategory') {
        return (
            <GenreSubcategoryPage
                selectedGenre={selectedGenre}
                onBack={BackTo}
                onSubcategorySelect={handleSubcategorySelect}
            />
        );
    }

    // Genre List Page
    const NoticeItem = ({ notice }) => (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg mb-3"
        >
            <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                    <notice.icon className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm text-blue-800 font-medium">
                    {notice.title}
                </span>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400" />
        </motion.div>
    );

    const CategoryItem = ({ category }) => (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleGenreSelect(category.id)}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
            <div className="flex items-start space-x-4 flex-1">
                <div className="bg-gray-100 p-3 rounded-lg">
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {category.description}
                    </p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </motion.div>
    );

    return (
        <div className="max-w-2xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleBackToList}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />

                        </motion.button>
                        <h1 className="text-lg font-semibold text-gray-800">
                            {t('GenreCategory.listTitle')}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6">

                {/* Categories */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {t('GenreCategory.browseByCategory')}
                        </h2>
                    </div>

                    <div>
                        {genreCategories.map((category) => (
                            <CategoryItem key={category.id} category={category} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation Placeholder */}
            <BottomNavigationWithCreator active="ranking" />
            <div className="h-20"></div>
        </div>
    );
};

export default GenreNavigationSystem;