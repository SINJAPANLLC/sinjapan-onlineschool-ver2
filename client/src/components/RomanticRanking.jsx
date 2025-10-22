import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Crown, Bookmark, Clock } from 'lucide-react';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { useUserInteractions } from '../hooks/useUserInteractions';
import { useUserStats } from '../context/UserStatsContext';

const Ranking = () => {
    const navigate = useNavigate();
    const { likedPosts, savedPosts, toggleLike, toggleSave, isLiked, isSaved } = useUserInteractions();
    const { updateLikedCount, updateSavedCount } = useUserStats();
    const [localLikedPosts, setLocalLikedPosts] = useState(new Set());
    const [localSavedPosts, setLocalSavedPosts] = useState(new Set());

    // クリック機能
    const handleVideoClick = (post) => {
        navigate(`/video/${post.id}`);
    };

    const handleAccountClick = (post, e) => {
        e.stopPropagation();
        navigate(`/profile/${post.user.id}`);
    };

    const handleLikeClick = (postId, e) => {
        e.stopPropagation();
        const wasLiked = localLikedPosts.has(postId);
        
        setLocalLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
                updateLikedCount(-1);
            } else {
                newSet.add(postId);
                updateLikedCount(1);
            }
            return newSet;
        });
        
        toggleLike(postId).catch(error => {
            console.error('いいねの切り替えでエラーが発生しました:', error);
            updateLikedCount(wasLiked ? 1 : -1);
        });
    };

    const handleSaveClick = (postId, e) => {
        e.stopPropagation();
        const wasSaved = localSavedPosts.has(postId);
        
        setLocalSavedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
                updateSavedCount(-1);
            } else {
                newSet.add(postId);
                updateSavedCount(1);
            }
            return newSet;
        });
        
        toggleSave(postId).catch(error => {
            console.error('保存の切り替えでエラーが発生しました:', error);
            updateSavedCount(wasSaved ? 1 : -1);
        });
    };

    // サンプル画像を使用
    const thumbnailImages = [
        '/genre-1.png',
        '/genre-2.png',
        '/genre-3.png',
    ];

    const posts = [
        {
            id: 1,
            title: "【😏 反響殺到すぎて〜特別延長 23時59分まで！】※確実に最後...",
            duration: "48:18",
            likes: 820,
            bookmarks: 788,
            user: {
                name: "軟派(ナンパ)TOKYO",
                avatar: "/logo192.png"
            },
            thumbnail: thumbnailImages[0],
            badge: "NEW",
            isNew: true,
            postedDate: "4日前"
        },
        {
            id: 2,
            title: "【プレゼント企画あり🎁】Gカップグラビアスタイルの女の...",
            duration: "49:14",
            likes: 660,
            bookmarks: 633,
            user: {
                name: "じじのハメ撮り...",
                avatar: "/logo192.png"
            },
            thumbnail: thumbnailImages[1],
            isNew: false,
            postedDate: "3日前"
        },
        {
            id: 3,
            title: "【全員にプレゼント付き🎁】参加は一回限り💘特別な感謝祭...",
            duration: "30:54",
            likes: 3600,
            bookmarks: 3100,
            user: {
                name: "一緒に働きませんか？",
                avatar: "/logo192.png"
            },
            thumbnail: thumbnailImages[2],
            badge: "HOT",
            isNew: false,
            postedDate: "15日前"
        },
        {
            id: 4,
            title: "【100枚限定90%OFF】3時間のハメ撮り総集編があまり...",
            duration: "3:09:11",
            likes: 604,
            bookmarks: 528,
            user: {
                name: "白豚",
                avatar: "/logo192.png"
            },
            thumbnail: thumbnailImages[0],
            isNew: false,
            postedDate: "6日前"
        },
        {
            id: 5,
            title: "まじろさん(19) 職業：女子大生",
            duration: "45:56",
            likes: 520,
            bookmarks: 480,
            user: {
                name: "クリエイター5",
                avatar: "/logo192.png"
            },
            thumbnail: thumbnailImages[1],
            isNew: true,
            postedDate: "2日前"
        },
        {
            id: 6,
            title: "限定コンテンツ配信中",
            duration: "1:15:30",
            likes: 890,
            bookmarks: 750,
            user: {
                name: "クリエイター6",
                avatar: "/logo192.png"
            },
            thumbnail: thumbnailImages[2],
            isNew: false,
            postedDate: "1週間前"
        },
    ];

    const filteredPosts = posts;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="mb-12">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mr-2 p-1.5 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-md"
                    >
                        <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" strokeWidth={2.5} />
                    </motion.div>
                    総合ランキング
                </h2>
            </div>

            {/* Posts Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="all"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 gap-4"
                >
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                            onClick={() => handleVideoClick(post)}
                            data-testid={`ranking-card-${post.id}`}
                        >
                            {/* サムネイル */}
                            <div className="relative aspect-square overflow-hidden">
                                <motion.img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    animate={{ 
                                        scale: [1, 1.05, 1],
                                        x: [0, 5, 0],
                                        y: [0, -3, 0]
                                    }}
                                    transition={{ 
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    whileHover={{ scale: 1.15 }}
                                />
                                
                                {/* ランキングバッジ */}
                                <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="absolute top-2 left-2 w-9 h-9 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                                    style={{ boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)' }}
                                >
                                    <span className="text-white font-black text-sm drop-shadow-md">{index + 1}</span>
                                </motion.div>
                                
                                {/* NEWバッジ */}
                                {post.isNew && (
                                    <motion.div 
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: index * 0.1 + 0.3 
                                        }}
                                        className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                                    >
                                        <motion.span
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            NEW
                                        </motion.span>
                                    </motion.div>
                                )}
                                
                                {/* 動画時間 */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.4 }}
                                    className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-semibold"
                                >
                                    {post.duration}
                                </motion.div>
                            </div>

                            {/* カード情報 */}
                            <div className="p-3">
                                {/* タイトル */}
                                <h3 className="text-sm font-medium line-clamp-2 mb-2 text-gray-800 leading-snug">
                                    {post.title}
                                </h3>

                                {/* クリエイター情報 */}
                                <div 
                                    className="flex items-center mb-2"
                                    onClick={(e) => handleAccountClick(post, e)}
                                >
                                    <img
                                        src={post.user.avatar}
                                        alt={post.user.name}
                                        className="w-6 h-6 rounded-full mr-2 object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-600 truncate">{post.user.name}</p>
                                        <p className="text-xs text-gray-400">{post.postedDate}</p>
                                    </div>
                                </div>

                                {/* 統計情報 */}
                                <div className="flex items-center gap-3 text-xs">
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                                        onClick={(e) => handleLikeClick(post.id, e)}
                                        data-testid={`like-button-${post.id}`}
                                    >
                                        <Heart 
                                            className={`w-4 h-4 transition-all ${localLikedPosts.has(post.id) ? 'fill-blue-500 text-blue-500 scale-110' : 'text-gray-400'}`}
                                            strokeWidth={2.5}
                                        />
                                        <span className="text-gray-600 font-medium">{post.likes}</span>
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                                        onClick={(e) => handleSaveClick(post.id, e)}
                                        data-testid={`save-button-${post.id}`}
                                    >
                                        <Bookmark 
                                            className={`w-4 h-4 transition-all ${localSavedPosts.has(post.id) ? 'fill-blue-500 text-blue-500 scale-110' : 'text-gray-400'}`}
                                            strokeWidth={2.5}
                                        />
                                        <span className="text-gray-600 font-medium">{post.bookmarks}</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {filteredPosts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="text-6xl mb-4">💕</div>
                    <p className="text-gray-500 text-lg">コンテンツがありません</p>
                </motion.div>
            )}
        </div>
    );
};

export default Ranking;
