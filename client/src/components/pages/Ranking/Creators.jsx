import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Plus, Eye, Heart, Users, UserPlus, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { useAuth } from '../../../context/AuthContext';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import instructorImg1 from '@assets/スクリーンショット 2025-10-08 22.17.14_1760917144953.png';
import instructorImg2 from '@assets/00035-3167998813_1760917144953.png';
import instructorImg3 from '@assets/スクリーンショット 2025-10-08 22.23.36_1760917144953.png';
import instructorImg4 from '@assets/00220-1604543024_0_1760917144953.png';
import instructorImg5 from '@assets/00021-2650716505_0_1760917144954.jpg';
import instructorImg6 from '@assets/00465-2336099699_0_1760917144954.jpg';

const Instructor = ({ activeTimeFilter }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const db = getFirestore();
    const [followedInstructors, setFollowedInstructors] = useState(new Set());

    const handleClick = () => {
        navigate('/GenreNavigationSystem');
    };

    // Load followed instructors from Firestore
    useEffect(() => {
        const loadFollowedInstructors = async () => {
            if (!currentUser) return;
            
            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const following = userDoc.data().following || [];
                    setFollowedInstructors(new Set(following));
                }
            } catch (error) {
                console.error('Error loading followed instructors:', error);
            }
        };

        loadFollowedInstructors();
    }, [currentUser, db]);

    // Toggle follow/unfollow
    const toggleFollow = async (creatorId) => {
        if (!currentUser) {
            alert(t('pleaseLogin'));
            return;
        }

        const isFollowing = followedInstructors.has(creatorId);
        const userRef = doc(db, 'users', currentUser.uid);

        try {
            if (isFollowing) {
                // Unfollow
                await updateDoc(userRef, {
                    following: arrayRemove(creatorId)
                });
                setFollowedInstructors(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(creatorId);
                    return newSet;
                });
            } else {
                // Follow
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    await updateDoc(userRef, {
                        following: arrayUnion(creatorId)
                    });
                } else {
                    await setDoc(userRef, {
                        following: [creatorId]
                    }, { merge: true });
                }
                setFollowedInstructors(prev => new Set([...prev, creatorId]));
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            alert('フォロー操作に失敗しました');
        }
    };

    // Raw instructor data by time period (unsorted)
    const instructorsDataRaw = {
        Daily: [
            {
                id: 1,
                name: "美咲ちゃん",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "15.3K",
                likes: "12.4K",
                description: "毎日楽しい配信をお届けします♪",
                isVerified: true,
                plan: "見放題プラン",
                planPrice: "¥6,980",
                courses: "45",
                recommendation: "💙 見放題プラン 💙",
                purchaseAmount: 85000
            },
            {
                id: 2,
                name: "とうま【痩イキ オイルマッサージ】",
                avatar: instructorImg2,
                backgroundImage: instructorImg2,
                followers: "24.1K",
                likes: "27.1K",
                description: "痩イキ オイルマッサージの専門家",
                isVerified: false,
                plan: "マッサージプラン",
                planPrice: "¥8,980",
                courses: "67",
                recommendation: "💆 マッサージプラン 💆",
                purchaseAmount: 72000
            },
            {
                id: 3,
                name: "完全サロンの秘密_ALL単品",
                avatar: instructorImg3,
                backgroundImage: instructorImg3,
                followers: "10.3K",
                likes: "7.2K",
                description: "大人の魅力をお届けします",
                isVerified: true,
                plan: "プレミアムプラン",
                planPrice: "¥9,980",
                courses: "89",
                recommendation: "🌸 プレミアムプラン 🌸",
                purchaseAmount: 65000
            },
            {
                id: 4,
                name: "美魚spasm 🌸",
                avatar: instructorImg4,
                backgroundImage: instructorImg4,
                followers: "23.7K",
                likes: "18.0K",
                description: "可愛いコスプレ配信♪",
                isVerified: true,
                plan: "コスプレプラン",
                planPrice: "¥5,980",
                courses: "123",
                recommendation: "👗 コスプレプラン 👗",
                purchaseAmount: 58000
            },
            {
                id: 5,
                name: "SNAPTOKYO【スナップトーキョー】",
                avatar: instructorImg5,
                backgroundImage: instructorImg5,
                followers: "18.1K",
                likes: "25.4K",
                description: "楽しいチャット配信中！",
                isVerified: false,
                plan: "チャットプラン",
                planPrice: "¥3,980",
                courses: "234",
                recommendation: "💬 チャットプラン 💬",
                purchaseAmount: 52000
            }
        ],
        Weekly: [
            {
                id: 1,
                name: "美咲ちゃん",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "15.3K",
                likes: "12.4K",
                description: "毎日楽しい配信をお届けします♪",
                isVerified: true,
                plan: "見放題プラン",
                planPrice: "¥6,980",
                courses: "45",
                recommendation: "💙 見放題プラン 💙",
                purchaseAmount: 425000
            },
            {
                id: 6,
                name: "癒しのゆりか",
                avatar: instructorImg6,
                backgroundImage: instructorImg6,
                followers: "18.3K",
                likes: "22.5K",
                description: "癒しのマッサージをお届け",
                isVerified: true,
                plan: "マッサージプラン",
                planPrice: "¥7,980",
                courses: "56",
                recommendation: "💆 マッサージプラン 💆",
                purchaseAmount: 385000
            },
            {
                id: 7,
                name: "リラックス★みお",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "15.7K",
                likes: "19.2K",
                description: "リラックスタイムをお届け",
                isVerified: false,
                plan: "リラックスプラン",
                planPrice: "¥6,480",
                courses: "78",
                recommendation: "✨ リラックスプラン ✨",
                purchaseAmount: 342000
            },
            {
                id: 2,
                name: "とうま【痩イキ オイルマッサージ】",
                avatar: instructorImg2,
                backgroundImage: instructorImg2,
                followers: "24.1K",
                likes: "27.1K",
                description: "痩イキ オイルマッサージの専門家",
                isVerified: false,
                plan: "マッサージプラン",
                planPrice: "¥8,980",
                courses: "67",
                recommendation: "💆 マッサージプラン 💆",
                purchaseAmount: 298000
            },
            {
                id: 8,
                name: "大人の時間★あい",
                avatar: instructorImg2,
                backgroundImage: instructorImg2,
                followers: "16.8K",
                likes: "31.2K",
                description: "大人の時間をお楽しみください",
                isVerified: true,
                plan: "プレミアムプラン",
                planPrice: "¥9,980",
                courses: "92",
                recommendation: "🌸 プレミアムプラン 🌸",
                purchaseAmount: 265000
            }
        ],
        Monthly: [
            {
                id: 1,
                name: "美咲ちゃん",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "15.3K",
                likes: "12.4K",
                description: "毎日楽しい配信をお届けします♪",
                isVerified: true,
                plan: "見放題プラン",
                planPrice: "¥6,980",
                courses: "45",
                recommendation: "💙 見放題プラン 💙",
                purchaseAmount: 1825000
            },
            {
                id: 4,
                name: "美魚spasm 🌸",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "23.7K",
                likes: "18.0K",
                description: "可愛いコスプレ配信♪",
                isVerified: true,
                plan: "コスプレプラン",
                planPrice: "¥5,980",
                courses: "123",
                recommendation: "👗 コスプレプラン 👗",
                purchaseAmount: 1562000
            },
            {
                id: 5,
                name: "SNAPTOKYO【スナップトーキョー】",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "18.1K",
                likes: "25.4K",
                description: "楽しいチャット配信中！",
                isVerified: false,
                plan: "チャットプラン",
                planPrice: "¥3,980",
                courses: "234",
                recommendation: "💬 チャットプラン 💬",
                purchaseAmount: 1328000
            },
            {
                id: 10,
                name: "アニメ★かな",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "14.6K",
                likes: "42.1K",
                description: "アニメコスプレ配信",
                isVerified: true,
                plan: "コスプレプラン",
                planPrice: "¥6,480",
                courses: "156",
                recommendation: "🎀 コスプレプラン 🎀",
                purchaseAmount: 1185000
            },
            {
                id: 2,
                name: "とうま【痩イキ オイルマッサージ】",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "24.1K",
                likes: "27.1K",
                description: "痩イキ オイルマッサージの専門家",
                isVerified: false,
                plan: "マッサージプラン",
                planPrice: "¥8,980",
                courses: "67",
                recommendation: "💆 マッサージプラン 💆",
                purchaseAmount: 982000
            }
        ],
        AllTime: [
            {
                id: 1,
                name: "美咲ちゃん",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "15.3K",
                likes: "12.4K",
                description: "毎日楽しい配信をお届けします♪",
                isVerified: true,
                plan: "見放題プラン",
                planPrice: "¥6,980",
                courses: "45",
                recommendation: "💙 見放題プラン 💙",
                purchaseAmount: 8950000
            },
            {
                id: 4,
                name: "美魚spasm 🌸",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "23.7K",
                likes: "18.0K",
                description: "可愛いコスプレ配信♪",
                isVerified: true,
                plan: "コスプレプラン",
                planPrice: "¥5,980",
                courses: "123",
                recommendation: "👗 コスプレプラン 👗",
                purchaseAmount: 7285000
            },
            {
                id: 2,
                name: "とうま【痩イキ オイルマッサージ】",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "24.1K",
                likes: "27.1K",
                description: "痩イキ オイルマッサージの専門家",
                isVerified: false,
                plan: "マッサージプラン",
                planPrice: "¥8,980",
                courses: "67",
                recommendation: "💆 マッサージプラン 💆",
                purchaseAmount: 6420000
            },
            {
                id: 5,
                name: "SNAPTOKYO【スナップトーキョー】",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "18.1K",
                likes: "25.4K",
                description: "楽しいチャット配信中！",
                isVerified: false,
                plan: "チャットプラン",
                planPrice: "¥3,980",
                courses: "234",
                recommendation: "💬 チャットプラン 💬",
                purchaseAmount: 5875000
            },
            {
                id: 12,
                name: "おしゃべり★なな",
                avatar: instructorImg1,
                backgroundImage: instructorImg1,
                followers: "19.3K",
                likes: "54.7K",
                description: "おしゃべりが大好き！",
                isVerified: true,
                plan: "チャットプラン",
                planPrice: "¥4,280",
                courses: "198",
                recommendation: "💬 チャットプラン 💬",
                purchaseAmount: 4920000
            }
        ]
    };

    // Sort instructors by purchaseAmount (highest first) and add rank
    const sortedInstructors = useMemo(() => {
        const instructors = [...(instructorsDataRaw[activeTimeFilter] || [])];
        return instructors.sort((a, b) => b.purchaseAmount - a.purchaseAmount);
    }, [activeTimeFilter]);

    const topInstructor = sortedInstructors[0];
    const otherInstructors = sortedInstructors.slice(1);

    const TopInstructorCard = ({ instructor, categoryTitle }) => {
        const isFollowing = followedInstructors.has(instructor.id);
        
        return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 mb-4 relative"
            data-testid="card-top-instructor"
        >
            {/* Ranking Badge */}
            <motion.div 
                className="absolute top-4 left-4 z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                data-testid="rank-badge-1"
            >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
                    1位
                </div>
            </motion.div>

            {/* Profile Image - No Background Header */}
            <div className="pt-8 flex justify-center">
                <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <div 
                        className="relative cursor-pointer"
                        onClick={() => navigate(`/instructor-profile/${instructor.id}`)}
                    >
                        <motion.img
                            src={instructor.avatar}
                            alt={instructor.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-200 shadow-2xl"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                            data-testid={`img-avatar-${instructor.id}`}
                        />
                        {instructor.isVerified && (
                            <motion.div 
                                className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full p-1.5 shadow-lg"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                data-testid={`verified-badge-${instructor.id}`}
                            >
                                <Crown className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Profile Content */}
            <div className="pt-4 pb-4 px-4 text-center">
                <motion.h3 
                    className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    data-testid={`text-instructor-name-${instructor.id}`}
                >
                    {instructor.name}
                </motion.h3>

                <motion.div 
                    className="flex items-center justify-center space-x-6 text-sm mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div 
                        className="flex items-center space-x-1.5"
                        whileHover={{ scale: 1.1 }}
                        data-testid={`count-likes-${instructor.id}`}
                    >
                        <Heart className="w-5 h-5 text-blue-500 fill-blue-500" />
                        <span className="font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{instructor.likes}</span>
                    </motion.div>
                    <motion.div 
                        className="flex items-center space-x-1.5"
                        whileHover={{ scale: 1.1 }}
                        data-testid={`count-followers-${instructor.id}`}
                    >
                        <Users className="w-5 h-5 text-blue-500 fill-blue-500" />
                        <span className="font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{instructor.followers}</span>
                        <span className="text-gray-500 text-xs">{t('instructorPage.followers')}</span>
                    </motion.div>
                </motion.div>

                <motion.p 
                    className="text-sm text-gray-600 mb-4 px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    data-testid={`text-description-${instructor.id}`}
                >
                    {instructor.description}
                </motion.p>

                {/* Follow Button */}
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(instructor.id);
                    }}
                    className={`w-full py-3 rounded-xl text-base font-bold transition-all shadow-lg flex items-center justify-center space-x-2 ${
                        isFollowing
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-blue-200'
                    }`}
                    data-testid={`button-follow-${instructor.id}`}
                >
                    {isFollowing ? (
                        <>
                            <UserCheck className="w-5 h-5" />
                            <span>フォロー中</span>
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-5 h-5" />
                            <span>{t('instructorPage.subscribe')}</span>
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
        );
    };

    const InstructorListItem = ({ instructor, rank }) => {
        const isFollowing = followedInstructors.has(instructor.id);
        
        return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, x: 5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md mb-2"
            data-testid={`card-instructor-${instructor.id}`}
        >
            <motion.div 
                className="flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-sm font-bold px-2.5 py-1.5 rounded-full w-10 h-10 flex items-center justify-center shadow-md" data-testid={`rank-badge-${rank}`}>
                    {rank}位
                </div>
            </motion.div>

            <motion.div
                className="relative flex-shrink-0 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/instructor-profile/${instructor.id}`)}
            >
                <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow-md"
                    data-testid={`img-avatar-${instructor.id}`}
                />
                {instructor.isVerified && (
                    <div className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full p-0.5 shadow-md" data-testid={`verified-badge-${instructor.id}`}>
                        <Crown className="w-3 h-3 fill-white" />
                    </div>
                )}
            </motion.div>

            <div className="flex-1 min-w-0">
                <motion.h4 
                    className="text-sm sm:text-base font-bold text-gray-900 truncate mb-1"
                    whileHover={{ scale: 1.02 }}
                    data-testid={`text-instructor-name-${instructor.id}`}
                >
                    {instructor.name}
                </motion.h4>
                <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1" data-testid={`count-followers-${instructor.id}`}>
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{instructor.followers}</span>
                    </div>
                    <div className="flex items-center space-x-1" data-testid={`count-likes-${instructor.id}`}>
                        <Heart className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{instructor.likes}</span>
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(instructor.id);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md flex items-center space-x-1 ${
                    isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-blue-200'
                }`}
                data-testid={`button-follow-${instructor.id}`}
            >
                {isFollowing ? (
                    <>
                        <UserCheck className="w-4 h-4" />
                        <span>フォロー中</span>
                    </>
                ) : (
                    <>
                        <UserPlus className="w-4 h-4" />
                        <span>{t('instructorPage.subscribe')}</span>
                    </>
                )}
            </motion.button>
        </motion.div>
        );
    };

    return (
        <div className="space-y-6 pb-6">
            {/* Overall Ranking Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center space-x-2 mb-4 px-2" data-testid="section-overall-ranking">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Crown className="w-6 h-6 text-blue-600 fill-blue-600" />
                    </motion.div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        {t('instructorPage.overallRanking')}
                    </h2>
                </div>

                {/* Top Instructor Card */}
                {topInstructor && <TopInstructorCard instructor={topInstructor} categoryTitle={t('instructorPage.overallRanking')} />}

                {/* Other Instructors List */}
                <div className="space-y-2">
                    {otherInstructors.map((instructor, index) => (
                        <InstructorListItem 
                            key={instructor.id} 
                            instructor={instructor} 
                            rank={index + 2}
                        />
                    ))}
                </div>

                {/* Show All Button */}
                <motion.button
                    onClick={handleClick}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                    data-testid="button-show-all-instructors"
                >
                    <Eye className="w-5 h-5" />
                    <span>{t('instructorPage.seeAll')}</span>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Instructor;
