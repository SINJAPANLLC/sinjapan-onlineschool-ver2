import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Bookmark, UserPlus, Check } from 'lucide-react';
import { t } from 'i18next';

const FeaturedAdminPage = () => {
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
    const [followedUsers, setFollowedUsers] = useState(new Set());
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // サムネイル画像
    const thumbnailImages = [
        '/genre-1.png',
        '/genre-2.png',
        '/genre-3.png',
    ];

    const featuredUsers = [
        {
            id: 1,
            name: "Jukiya",
            avatar: "/logo192.png",
            likes: "33K",
            followers: "253K",
            isVerified: true
        },
        {
            id: 2,
            name: "The daily life of a secret a...",
            avatar: "/logo192.png",
            likes: "64.6K",
            followers: "101.6K",
            isVerified: false
        },
        {
            id: 3,
            name: "Male -YUU- NTR with a b...",
            avatar: "/logo192.png",
            likes: "56.0K",
            followers: "106.3K",
            isVerified: true
        },
        {
            id: 4,
            name: "🔥🔥Secret Account Jap...",
            avatar: "/logo192.png",
            likes: "254.4K",
            followers: "379.2K",
            isVerified: true
        },
        {
            id: 5,
            name: "SNAPTOKYO",
            avatar: "/logo192.png",
            likes: "186.8K",
            followers: "229.1K",
            isVerified: false
        },
        {
            id: 6,
            name: "Squirting Rurutan🩵",
            avatar: "/logo192.png",
            likes: "16.7K",
            followers: "118.5K",
            isVerified: true
        }
    ];

    // Load featured pickups from API
    useEffect(() => {
        loadFeaturedPickups();
    }, []);

    const loadFeaturedPickups = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/featured-pickup');
            const pickups = await response.json();
            
            // API now returns pickups with embedded post details
            const postsWithData = pickups.map((pickup) => {
                const postData = pickup.post;
                if (!postData) return null;
                
                // Calculate time ago
                const timeAgo = calculateTimeAgo(new Date(postData.createdAt));
                
                return {
                    id: postData.id,
                    title: postData.title,
                    duration: postData.duration,
                    thumbnail: postData.thumbnail,
                    user: {
                        name: postData.userName,
                        avatar: postData.userAvatar,
                        timeAgo: timeAgo,
                        followers: postData.userFollowers
                    },
                    likes: postData.likes,
                    bookmarks: postData.bookmarks,
                    isNew: postData.isNew,
                    position: pickup.position
                };
            }).filter(post => post !== null);
            
            // Already sorted by position from API
            setFeaturedPosts(postsWithData);
        } catch (error) {
            console.error('Error loading featured pickups:', error);
            // Fallback to default posts if API fails
            setFeaturedPosts(getDefaultPosts());
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTimeAgo = (date) => {
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            if (diffInHours === 0) {
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                return `${diffInMinutes}分前`;
            }
            return `${diffInHours}時間前`;
        } else if (diffInDays === 1) {
            return '1日前';
        } else if (diffInDays < 7) {
            return `${diffInDays}日前`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks}週間前`;
        } else if (diffInDays < 365) {
            const months = Math.floor(diffInDays / 30);
            return `${months}ヶ月前`;
        } else {
            const years = Math.floor(diffInDays / 365);
            return `${years}年前`;
        }
    };

    const getDefaultPosts = () => {
        // Default posts when no API data available
        return [
            {
                id: 1,
                title: "Boing boing",
                duration: "00:06",
                user: {
                    name: "Sakura",
                    avatar: "/logo192.png",
                    timeAgo: "3日前",
                    followers: 25300
                },
                likes: 32,
                bookmarks: 19,
                isNew: true
            },
            {
                id: 2,
                title: "After groping her I-cup breasts with their lewdly huge areolas and interviewing her...",
                duration: "49:30",
                user: {
                    name: "Big Breasts Academy",
                    avatar: "/logo192.png",
                    timeAgo: "1日前",
                    followers: 101600
                },
                likes: 11,
                bookmarks: 11,
                isNew: false
            },
            {
                id: 3,
                title: "Obon Limited!! Giveaway!! [Please read carefully to the end] Special price.",
                duration: "Limited",
                user: {
                    name: "Yoga Teacher",
                    avatar: "/logo192.png",
                    timeAgo: "2日前",
                    followers: 78900
                },
                likes: 57,
                bookmarks: 50,
                isNew: true
            },
            {
                id: 4,
                title: "A short elementary school teacher with big tits came to the room, so I hugged he...",
                duration: "26:31",
                user: {
                    name: "Kei",
                    avatar: "/logo192.png",
                    timeAgo: "1ヶ月前",
                    followers: 45200
                },
                likes: 111,
                bookmarks: 111,
                isNew: false
            }
        ];
    };

    const toggleLike = (postId) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const toggleBookmark = (postId) => {
        setBookmarkedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const toggleFollow = (userId) => {
        setFollowedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
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

    if (isLoading) {
        return (
            <div className="mb-12">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="mr-2 p-1.5 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 shadow-md"
                    >
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" strokeWidth={2.5} />
                    </motion.div>
                    {t('featuredAdmin.header')}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-200 animate-pulse rounded-lg aspect-square"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-12">
            {/* 運営Pickup投稿セクション */}
            <div className="mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="mr-2 p-1.5 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 shadow-md"
                        data-testid="icon-featured-star"
                    >
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" strokeWidth={2.5} />
                    </motion.div>
                    {t('featuredAdmin.header')}
                </h2>

                {/* Posts Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 gap-4"
                >
                    {featuredPosts.map((post, index) => {
                        const thumbnailUrl = post.thumbnail || thumbnailImages[index % thumbnailImages.length];
                        
                        return (
                            <motion.div
                                key={post.id}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                                data-testid={`featured-card-${post.id}`}
                            >
                                {/* サムネイル */}
                                <div className="relative aspect-square overflow-hidden">
                                    <motion.img
                                        src={thumbnailUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                        animate={{ 
                                            scale: [1, 1.05, 1],
                                            x: [0, -5, 0],
                                            y: [0, 3, 0]
                                        }}
                                        transition={{ 
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.2
                                        }}
                                        whileHover={{ scale: 1.15 }}
                                    />
                                    
                                    {/* ランキングバッジ */}
                                    <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="absolute top-2 left-2 w-9 h-9 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 rounded-full flex items-center justify-center"
                                        style={{ boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)' }}
                                        data-testid={`rank-badge-featured-${index + 1}`}
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
                                            className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                                            data-testid={`new-badge-featured-${post.id}`}
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
                                        data-testid={`duration-${post.id}`}
                                    >
                                        {post.duration}
                                    </motion.div>
                                </div>

                                {/* カード情報 */}
                                <div className="p-3">
                                    {/* タイトル */}
                                    <h3 className="text-sm font-medium line-clamp-2 mb-2 text-gray-800 leading-snug" data-testid={`title-${post.id}`}>
                                        {post.title}
                                    </h3>

                                    {/* クリエイター情報 */}
                                    <div className="flex items-center mb-2">
                                        <img
                                            src={post.user.avatar}
                                            alt={post.user.name}
                                            className="w-6 h-6 rounded-full mr-2 object-cover"
                                            data-testid={`avatar-${post.id}`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-600 truncate" data-testid={`username-${post.id}`}>{post.user.name}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <span data-testid={`time-ago-${post.id}`}>{post.user.timeAgo}</span>
                                                {post.user.followers && (
                                                    <>
                                                        <span>•</span>
                                                        <span data-testid={`followers-${post.id}`}>
                                                            {post.user.followers.toLocaleString()} フォロワー
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 統計情報 */}
                                    <div className="flex items-center gap-3 text-xs">
                                        <button 
                                            className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                                            onClick={() => toggleLike(post.id)}
                                            data-testid={`like-button-featured-${post.id}`}
                                        >
                                            <Heart 
                                                className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`}
                                            />
                                            <span className="text-gray-600">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                                        </button>
                                        <button 
                                            className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                                            onClick={() => toggleBookmark(post.id)}
                                            data-testid={`save-button-featured-${post.id}`}
                                        >
                                            <Bookmark 
                                                className={`w-4 h-4 ${bookmarkedPosts.has(post.id) ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`}
                                            />
                                            <span className="text-gray-600">{post.bookmarks + (bookmarkedPosts.has(post.id) ? 1 : 0)}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* ユーザーカードリスト */}
            <div>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    {featuredUsers.map((user, index) => {
                        const avatarUrl = thumbnailImages[index % thumbnailImages.length];
                        
                        return (
                            <motion.div
                                key={user.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.005 }}
                                className="bg-white rounded-xl p-3 border border-gray-200 hover:shadow-sm transition-all"
                                data-testid={`user-list-card-${user.id}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    {/* ランキングバッジ - 数字表示 */}
                                    <motion.div 
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 text-white flex items-center justify-center flex-shrink-0"
                                        style={{ boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)' }}
                                        data-testid={`rank-badge-user-${index + 1}`}
                                    >
                                        <span className="text-sm font-black drop-shadow-md">{index + 1}</span>
                                    </motion.div>

                                    {/* アバターと認証マーク */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={avatarUrl}
                                            alt={user.name}
                                            className="w-11 h-11 rounded-full object-cover"
                                            data-testid={`avatar-user-${user.id}`}
                                        />
                                        {user.isVerified && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white" data-testid={`verified-badge-${user.id}`}>
                                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>

                                    {/* ユーザー情報 */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-800 text-sm truncate mb-0.5 leading-tight" data-testid={`username-user-${user.id}`}>
                                            {user.name}
                                        </h3>

                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="flex items-center gap-0.5 text-pink-500">
                                                <Heart size={12} className="fill-current" />
                                                <span className="font-medium" data-testid={`likes-user-${user.id}`}>{user.likes}</span>
                                            </div>
                                            <div className="text-gray-400" data-testid={`followers-user-${user.id}`}>
                                                {user.followers} フォロワー
                                            </div>
                                        </div>
                                    </div>

                                    {/* フォローボタン */}
                                    <button
                                        onClick={() => toggleFollow(user.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2 flex items-center gap-1 flex-shrink-0 ${
                                            followedUsers.has(user.id)
                                                ? "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                                                : "bg-white border-pink-500 text-pink-500 hover:bg-pink-50"
                                        }`}
                                        data-testid={`follow-button-user-${user.id}`}
                                    >
                                        <UserPlus size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default FeaturedAdminPage;
