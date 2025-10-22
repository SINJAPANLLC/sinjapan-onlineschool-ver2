import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, BookOpen, GraduationCap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const categories = [
        { id: 'programming', label: 'プログラミング', count: 245 },
        { id: 'design', label: 'デザイン', count: 178 },
        { id: 'business', label: 'ビジネス', count: 156 },
        { id: 'language', label: '語学', count: 134 },
        { id: 'data', label: 'データサイエンス', count: 98 },
        { id: 'marketing', label: 'マーケティング', count: 87 },
    ];

    const popularSearches = [
        'JavaScript',
        'Python',
        'React',
        'デザイン思考',
        'ビジネス英語',
        'SQL',
        'UI/UX',
        'マーケティング基礎'
    ];

    const topInstructors = [
        { 
            id: 1, 
            name: '山田太郎', 
            students: 5420, 
            courses: 12, 
            avatar: '/logo-school.jpg',
            expertise: 'プログラミング'
        },
        { 
            id: 2, 
            name: '佐藤花子', 
            students: 4890, 
            courses: 8, 
            avatar: '/logo-school.jpg',
            expertise: 'デザイン'
        },
        { 
            id: 3, 
            name: '田中美咲', 
            students: 3560, 
            courses: 15, 
            avatar: '/logo-school.jpg',
            expertise: 'ビジネス'
        },
    ];

    const handleCategoryClick = (categoryId) => {
        navigate(`/feed?category=${categoryId}`);
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/feed?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePopularSearch = (term) => {
        navigate(`/feed?search=${encodeURIComponent(term)}`);
    };

    const handleInstructorClick = (creatorId) => {
        navigate(`/profile/${creatorId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                            data-testid="button-back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">コース検索</h1>
                            <p className="text-sm text-blue-100">学びたいコースを見つけよう</p>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="コース名、講師名、キーワードで検索"
                            className="w-full pl-12 pr-12 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium shadow-lg"
                            data-testid="input-search"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')} 
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Search Results */}
                <AnimatePresence>
                    {searchTerm && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <button
                                onClick={handleSearch}
                                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all"
                                data-testid="button-search-submit"
                            >
                                <Search className="w-5 h-5" />
                                <span className="font-semibold">「{searchTerm}」で検索</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        カテゴリ
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * index }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCategoryClick(category.id)}
                                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl text-left transition-all border-2 border-blue-200"
                                data-testid={`category-${category.id}`}
                            >
                                <div className="font-bold text-gray-800">{category.label}</div>
                                <div className="text-sm text-gray-600 mt-1">{category.count}コース</div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Popular Searches */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">人気の検索キーワード</h2>
                    <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * index }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePopularSearch(term)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 rounded-full font-semibold text-sm transition-all"
                                data-testid={`popular-search-${index}`}
                            >
                                {term}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Top Instructors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        人気講師
                    </h2>
                    <div className="space-y-3">
                        {topInstructors.map((instructor, index) => (
                            <motion.div
                                key={instructor.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                onClick={() => handleInstructorClick(instructor.id)}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl cursor-pointer transition-all border-2 border-transparent hover:border-blue-200"
                                data-testid={`instructor-${instructor.id}`}
                            >
                                <img
                                    src={instructor.avatar}
                                    alt={instructor.name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{instructor.name}</h3>
                                    <p className="text-sm text-gray-600">{instructor.expertise}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span>{instructor.students.toLocaleString()}人の学生</span>
                                        <span>{instructor.courses}コース</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <BottomNavigationWithCreator active="feed" />
        </motion.div>
    );
};

export default SearchPage;
