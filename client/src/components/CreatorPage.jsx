import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Crown, UserPlus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CreatorPage = () => {
    const [followingCreators, setFollowingCreators] = useState(new Set());

    const navigate = useNavigate();
    const { t } = useTranslation();
    
    // アバター画像
    const avatarImages = [
        '/genre-1.png',
        '/genre-2.png',
        '/genre-3.png',
    ];
    
    const creators = [
        {
            id: 1,
            name: "Jukiya",
            likes: "33K",
            followers: "25.3K",
            isVerified: true,
        },
        {
            id: 2,
            name: "The daily life of a secret account boy",
            likes: "64.6K",
            followers: "101.6K",
            isVerified: true,
        },
        {
            id: 3,
            name: "Male -YUU- NTR with a boyfriend, a married...",
            likes: "56.0K",
            followers: "106.3K",
            isVerified: true,
        },
        {
            id: 4,
            name: "👑👑Secret Account Japan👑👑",
            likes: "254.4K",
            followers: "379.2K",
            isVerified: true,
        },
        {
            id: 5,
            name: "SNAPTOKYO",
            likes: "186.8K",
            followers: "229.1K",
            isVerified: true,
        },
        {
            id: 6,
            name: "Squirting Rurutan🧊",
            likes: "16.7K",
            followers: "118.5K",
            isVerified: true,
        }
    ];

    const toggleFollow = (creatorId) => {
        setFollowingCreators(prev => {
            const newSet = new Set(prev);
            if (newSet.has(creatorId)) {
                newSet.delete(creatorId);
            } else {
                newSet.add(creatorId);
            }
            return newSet;
        });
    };

    // ランキングバッジの色を取得
    const getRankBadgeColor = (rank) => {
        // すべてピンクのグラデーション
        return "bg-gradient-to-br from-blue-400 to-blue-600 text-white";
    };

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
            {/* Creator List */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
            >
                <div className="space-y-3">
                    {creators.map((creator, index) => {
                        const isFollowing = followingCreators.has(creator.id);
                        // 3つの画像を順番に繰り返す
                        const avatarUrl = avatarImages[index % avatarImages.length];

                        return (
                            <motion.div
                                key={creator.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.005 }}
                                className="bg-white rounded-xl p-3 border border-gray-200 hover:shadow-sm transition-all"
                                data-testid={`creator-card-${creator.id}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    {/* ランキングバッジ - 数字表示 */}
                                    <motion.div 
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        className={`w-11 h-11 rounded-full ${getRankBadgeColor(index + 1)} flex items-center justify-center flex-shrink-0`}
                                        style={{ boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)' }}
                                    >
                                        <span className="text-sm font-black drop-shadow-md">{index + 1}</span>
                                    </motion.div>

                                    {/* アバターと認証マーク */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={avatarUrl}
                                            alt={creator.name}
                                            className="w-11 h-11 rounded-full object-cover"
                                        />
                                        {creator.isVerified && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>

                                    {/* クリエイター情報 */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-800 text-sm truncate mb-0.5 leading-tight">
                                            {creator.name}
                                        </h3>

                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="flex items-center gap-0.5 text-blue-500">
                                                <Heart size={12} className="fill-current drop-shadow-sm" strokeWidth={2.5} />
                                                <span className="font-semibold">{creator.likes}</span>
                                            </div>
                                            <div className="text-gray-400">
                                                {creator.followers} {t('creatorPage.followers')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* フォローボタン */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleFollow(creator.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2 flex items-center gap-1 flex-shrink-0 ${
                                            isFollowing
                                                ? "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                                                : "bg-white border-blue-500 text-blue-500 hover:bg-blue-50"
                                        }`}
                                        data-testid={`follow-button-${creator.id}`}
                                    >
                                        <UserPlus size={14} strokeWidth={2.5} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* See More Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8"
                >
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/rankingpage')}
                        className="relative w-full overflow-hidden rounded-full py-4 font-semibold transition-all group"
                        style={{
                            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                        }}
                        data-testid="button-see-more-creators"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2 text-white text-sm">
                            <span>{t('creatorPage.seeMore')}</span>
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="group-hover:scale-110 transition-transform"
                            >
                                →
                            </motion.div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CreatorPage;
