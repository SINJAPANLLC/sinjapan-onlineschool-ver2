import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
    ArrowLeft, 
    Share2, 
    Heart, 
    MessageCircle, 
    Play, 
    Filter, 
    ChevronDown,
    Edit3,
    CheckCircle,
    Star,
    Video,
    Image,
    Eye,
    EyeOff,
    UserPlus,
    UserMinus,
    Copy,
    ExternalLink,
    Sparkles,
    X,
    Trash2
} from 'lucide-react';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc, orderBy, limit } from 'firebase/firestore';

// Initialize Stripe - only if public key is configured
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
    ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
    : null;

// Payment Form Component
const PaymentForm = ({ plan, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setErrorMessage(submitError.message || '決済情報の確認に失敗しました');
                setIsProcessing(false);
                return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/profile/${plan.creatorId}?subscription=success&plan=${plan.id}`,
                },
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message || '決済に失敗しました');
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment successful
                onSuccess();
            } else {
                setErrorMessage('決済の処理中です。しばらくお待ちください。');
                setIsProcessing(false);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setErrorMessage('決済処理中にエラーが発生しました');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errorMessage}
                </div>
            )}
            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold disabled:opacity-50"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
                >
                    {isProcessing ? '処理中...' : `¥${plan.total.toLocaleString()}を支払う`}
                </button>
            </div>
        </form>
    );
};

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [showRankings, setShowRankings] = useState(true);
    const [showAllPlans, setShowAllPlans] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isFollowing, setIsFollowing] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [contentData, setContentData] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [userNotFound, setUserNotFound] = useState(false);

    // Check for subscription status from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const subscriptionStatus = urlParams.get('subscription');

        if (subscriptionStatus === 'success') {
            alert('✅ サブスクリプションに加入しました！ご利用ありがとうございます。');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (subscriptionStatus === 'cancelled') {
            alert('決済がキャンセルされました。');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Firestore からユーザーデータを取得
    useEffect(() => {
        const fetchUserData = async () => {
            if (!id && !currentUser) return;
            
            const userId = id || currentUser?.uid;
            setLoading(true);

            try {
                // ユーザードキュメントを取得
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProfileData({
                        id: userId,
                        name: userData.displayName || userData.name || 'ユーザー',
                        emoji: userData.emoji || '',
                        username: userData.username || `@user${userId.slice(0, 6)}`,
                        bio: userData.bio || '',
                        avatar: userData.photoURL || userData.avatar || 'https://via.placeholder.com/150',
                        coverImage: userData.coverImage || '/images/logo-school.jpg',
                        isVerified: userData.isVerified || false,
                        stats: {
                            posts: userData.postsCount || 0,
                            likes: userData.likesCount || 0,
                            followers: userData.followersCount || 0,
                            following: userData.followingCount || 0
                        },
                        genreRankings: userData.genreRankings || [],
                        subscriptionPlans: userData.subscriptionPlans || []
                    });

                    setSubscriptionPlans(userData.subscriptionPlans || []);
                    
                    // フォロー状態を確認
                    if (currentUser && currentUser.uid !== userId) {
                        const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
                        if (currentUserDoc.exists()) {
                            const following = currentUserDoc.data().following || [];
                            setIsFollowing(following.includes(userId));
                        }
                    }
                } else {
                    // ユーザーが見つからない場合はデフォルトデータ
                    setProfileData({
                        id: userId,
                        name: 'ユーザー',
                        emoji: '',
                        username: '@user',
                        bio: '',
                        avatar: 'https://via.placeholder.com/150',
                        coverImage: '/images/logo-school.jpg',
                        isVerified: false,
                        stats: {
                            posts: 0,
                            likes: 0,
                            followers: 0,
                            following: 0
                        },
                        genreRankings: [],
                        subscriptionPlans: []
                    });
                }

                // ユーザーのコースを取得（エラーが発生しても処理を継続）
                try {
                    await fetchUserPosts(userId);
                } catch (postError) {
                    console.error('Error in fetchUserPosts:', postError);
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
                // Firestoreエラーの場合でもデフォルトデータを設定
                setUserNotFound(true);
                setProfileData({
                    id: userId,
                    name: 'ユーザー',
                    emoji: '',
                    username: '@user',
                    bio: 'このユーザーは存在しないか、データの取得に失敗しました。',
                    avatar: 'https://via.placeholder.com/150',
                    coverImage: '/images/logo-school.jpg',
                    isVerified: false,
                    stats: {
                        posts: 0,
                        likes: 0,
                        followers: 0,
                        following: 0
                    },
                    genreRankings: [],
                    subscriptionPlans: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, currentUser]);

    // Convert Object Storage URL to proxy URL
    const convertToProxyUrl = (url) => {
        if (!url) return url;
        
        // Skip conversion if already a proxy URL
        if (url.startsWith('/api/proxy/')) {
            return url;
        }
        
        // Handle /objects/ paths (old format)
        if (url.startsWith('/objects/')) {
            // Extract filename: /objects/filename.mp4 → filename.mp4
            const filename = url.replace('/objects/', '');
            // Default to public folder
            return `/api/proxy/public/${filename}`;
        }
        
        // Handle Object Storage URLs
        if (url.includes('storage.googleapis.com') && url.includes('replit-objstore')) {
            // Extract the path after the bucket name
            // Format: https://storage.googleapis.com/bucket-name/folder/filename
            const match = url.match(/replit-objstore-[^/]+\/(.+)$/);
            if (match) {
                const path = match[1]; // e.g., "public/xxx.mp4" or ".private/xxx.mp4"
                return `/api/proxy/${path}`;
            }
        }
        
        // Return original URL if not Object Storage
        return url;
    };

    // ユーザーのコースを取得
    const fetchUserPosts = async (userId) => {
        try {
            // Firestoreからコースを取得
            // Note: orderByを削除してインデックス不要にし、クライアント側でソート
            const postsRef = collection(db, 'posts');
            const q = query(
                postsRef, 
                where('userId', '==', userId)
            );
            const querySnapshot = await getDocs(q);

            const posts = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const originalUrl = data.files && data.files[0]?.url;
                const proxyUrl = convertToProxyUrl(originalUrl);
                
                console.log('ProfilePage - Original URL:', originalUrl, '→ Proxy URL:', proxyUrl);
                
                posts.push({
                    ...data,
                    id: doc.id,
                    type: data.files && data.files[0]?.type?.startsWith('video') ? 'video' : 'image',
                    thumbnail: proxyUrl,
                    duration: data.duration || '',
                    likes: data.likes || 0,
                    comments: data.comments || 0,
                    isFree: data.isFree || false,
                    isLiked: false,
                    watermark: data.watermark || '',
                    title: data.title || data.explanation,
                    createdAt: data.createdAt
                });
            });

            // クライアント側で作成日時の降順にソート（新しいコースが上）
            posts.sort((a, b) => {
                const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return bTime - aTime;
            });
            
            // 最新50件に制限
            const limitedPosts = posts.slice(0, 50);
            
            console.log('📋 Posts array:', limitedPosts.map(p => ({ id: p.id, thumbnail: p.thumbnail })));
            
            setUserPosts(limitedPosts);
            setContentData(limitedPosts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
            // エラー時は空の配列を設定
            setUserPosts([]);
            setContentData([]);
        }
    };

    const handleShare = async () => {
        if (!profileData) return;

        const shareData = {
            title: `${profileData.name}のプロフィール`,
            text: `${profileData.name}のSIN JAPAN SCHOOLプロフィールをチェック！`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('プロフィールURLをクリップボードにコピーしました！');
            }
        } catch (error) {
            console.error('シェアに失敗しました:', error);
            setShowShareModal(true);
        }
    };

    const handleFollow = async () => {
        if (!currentUser || !profileData) return;

        try {
            const currentUserRef = doc(db, 'users', currentUser.uid);
            const targetUserRef = doc(db, 'users', profileData.id);

            if (isFollowing) {
                // フォロー解除
                await updateDoc(currentUserRef, {
                    following: arrayRemove(profileData.id),
                    followingCount: increment(-1)
                });
                await updateDoc(targetUserRef, {
                    followers: arrayRemove(currentUser.uid),
                    followersCount: increment(-1)
                });
                setIsFollowing(false);
                alert(`${profileData.name}のフォローを解除しました。`);
            } else {
                // フォロー
                await updateDoc(currentUserRef, {
                    following: arrayUnion(profileData.id),
                    followingCount: increment(1)
                });
                await updateDoc(targetUserRef, {
                    followers: arrayUnion(currentUser.uid),
                    followersCount: increment(1)
                });
                setIsFollowing(true);
                alert(`${profileData.name}をフォローしました！`);
            }

            // プロフィールデータを再取得
            const updatedDoc = await getDoc(targetUserRef);
            if (updatedDoc.exists()) {
                const userData = updatedDoc.data();
                setProfileData(prev => ({
                    ...prev,
                    stats: {
                        ...prev.stats,
                        followers: userData.followersCount || 0
                    }
                }));
            }
        } catch (error) {
            console.error('フォロー操作に失敗しました:', error);
            alert('フォロー操作に失敗しました。しばらくしてからお試しください。');
        }
    };

    const handleMessage = () => {
        if (!profileData) return;
        navigate(`/messages?user=${profileData.username}`);
    };

    const handlePlanConfirm = async (planId) => {
        if (!currentUser) {
            alert('サブスクリプションに加入するにはログインが必要です。');
            navigate('/login');
            return;
        }

        try {
            const plan = subscriptionPlans.find(p => p.id === planId);
            if (!plan) {
                alert('プランが見つかりません。');
                return;
            }

            // Create Payment Intent for in-app payment
            const response = await fetch('/api/create-subscription-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: plan.id,
                    planTitle: plan.title,
                    planPrice: plan.price,
                    creatorId: profileData.id,
                    creatorName: profileData.name,
                }),
            });

            const data = await response.json();

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
                setShowPlanModal(planId);
            } else {
                throw new Error('Payment Intentの作成に失敗しました');
            }
        } catch (error) {
            console.error('決済の準備に失敗しました:', error);
            alert('決済の準備に失敗しました。しばらくしてからお試しください。');
        }
    };

    const handlePaymentSuccess = () => {
        alert('決済が完了しました！サブスクリプションが有効になりました。');
        setShowPlanModal(null);
        setClientSecret('');
        window.location.reload();
    };

    const handlePaymentCancel = () => {
        setShowPlanModal(null);
        setClientSecret('');
    };

    const handleContentLike = async (contentId) => {
        setContentData(prev => prev.map(item => {
            if (item.id === contentId) {
                return {
                    ...item,
                    isLiked: !item.isLiked,
                    likes: item.isLiked ? item.likes - 1 : item.likes + 1
                };
            }
            return item;
        }));
    };

    const handleContentClick = (contentId) => {
        const content = contentData.find(item => item.id === contentId);
        if (content.type === 'video') {
            navigate(`/video/${contentId}`);
        } else {
            navigate(`/image/${contentId}`);
        }
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        let filteredData = userPosts;
        
        if (filter === 'video') {
            filteredData = userPosts.filter(item => item.type === 'video');
        } else if (filter === 'image') {
            filteredData = userPosts.filter(item => item.type === 'image');
        }
        
        setContentData(filteredData);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('プロフィールURLをクリップボードにコピーしました！');
            setShowShareModal(false);
        } catch (error) {
            console.error('コピーに失敗しました:', error);
        }
    };

    const handleDeletePost = async (postId, event) => {
        event.stopPropagation();
        
        if (!window.confirm('このコースを削除してもよろしいですか？')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'posts', postId));
            
            // Update local state
            setUserPosts(prev => prev.filter(post => post.id !== postId));
            setContentData(prev => prev.filter(post => post.id !== postId));
            
            alert('コースを削除しました');
        } catch (error) {
            console.error('コース削除エラー:', error);
            alert('コースの削除に失敗しました');
        }
    };

    // Calculate total price with tax and platform fee
    const calculateTotalPrice = (basePrice) => {
        const priceMatch = basePrice.match(/\d+/);
        if (!priceMatch) return basePrice;
        
        const price = parseInt(priceMatch[0]);
        const tax = Math.floor(price * 0.10); // 10% tax
        const platformFee = Math.floor(price * 0.10); // 10% platform fee
        const total = price + tax + platformFee;
        
        return `${total.toLocaleString()}円`;
    };

    const displayedPlans = showAllPlans ? subscriptionPlans : subscriptionPlans.slice(0, 3);

    const isOwnProfile = currentUser && profileData && currentUser.uid === profileData.id;

    if (loading || !profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white sticky top-0 z-20 shadow-lg">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full" data-testid="button-back">
                    <ArrowLeft size={20} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleShare} className="p-2 hover:bg-white/20 rounded-full" data-testid="button-share">
                    <Share2 size={20} />
                </motion.button>
            </div>

            {/* Cover Image - Animated */}
            <motion.div 
                className="h-56 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden"
                initial={{ scaleY: 0, transformOrigin: "top" }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div
                    initial={{ scale: 1.3, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full h-full"
                >
                    <motion.img 
                        src={profileData.coverImage} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                        animate={{ 
                            scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                            duration: 8, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    />
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-blue-600/30" 
                />
                {/* Floating particles effect */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
                />
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-20 right-16 w-32 h-32 bg-white/10 rounded-full blur-xl"
                />
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute bottom-10 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"
                />
            </motion.div>

            {/* Profile Info */}
            <div className="px-4 pb-4 -mt-20 relative">
                <div className="flex items-start justify-between mb-4">
                    {/* Avatar with verification - Animated */}
                    <motion.div 
                        className="relative"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            <motion.div
                                animate={{ 
                                    boxShadow: [
                                        "0 0 20px rgba(59, 130, 246, 0.3)",
                                        "0 0 40px rgba(59, 130, 246, 0.5)",
                                        "0 0 20px rgba(59, 130, 246, 0.3)"
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="rounded-full"
                            >
                                <img 
                                    src={profileData.avatar} 
                                    alt={profileData.name} 
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover" 
                                    data-testid="img-avatar" 
                                />
                            </motion.div>
                            {profileData.isVerified && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                                    className="absolute bottom-0 right-0 z-20"
                                >
                                    <motion.div
                                        animate={{ 
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 360]
                                        }}
                                        transition={{ 
                                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                                        }}
                                        className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
                                        data-testid="verified-badge"
                                    >
                                        <CheckCircle size={20} />
                                    </motion.div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Action Buttons */}
                    {isOwnProfile ? (
                        <motion.button 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            whileHover={{ 
                                scale: 1.08,
                                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
                            }} 
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditProfile}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg mt-16 relative overflow-hidden group"
                            data-testid="button-edit-profile"
                        >
                            <motion.div
                                animate={{
                                    x: ["-100%", "100%"]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                            <motion.span 
                                className="relative z-10 flex items-center"
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <Edit3 className="w-4 h-4 inline mr-2" />
                                編集
                            </motion.span>
                        </motion.button>
                    ) : (
                        <div className="flex space-x-2 mt-16">
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                onClick={handleFollow}
                                className={`px-6 py-2 rounded-full font-bold shadow-lg ${
                                    isFollowing 
                                        ? 'bg-white text-blue-600 border-2 border-blue-600' 
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                }`}
                                data-testid="button-follow"
                            >
                                {isFollowing ? <UserMinus className="w-4 h-4 inline mr-2" /> : <UserPlus className="w-4 h-4 inline mr-2" />}
                                {isFollowing ? 'フォロー中' : 'フォロー'}
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                onClick={handleMessage}
                                className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-2 rounded-full font-bold shadow-lg"
                                data-testid="button-message"
                            >
                                <MessageCircle className="w-4 h-4 inline mr-2" />
                                メッセージ
                            </motion.button>
                        </div>
                    )}
                </div>

                {/* Name and username Card - Premium Style */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }}
                    className="mb-6 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 relative overflow-hidden"
                >
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                        }} 
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
                        className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-300/20 to-blue-500/20 rounded-full blur-3xl" 
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1.2, 1, 1.2],
                            rotate: [360, 180, 0]
                        }} 
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
                        className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl" 
                    />
                    <div className="relative z-10">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 bg-clip-text text-transparent flex items-center mb-2" data-testid="text-profile-name">
                            {profileData.name} 
                            {profileData.emoji && <span className="ml-2 text-3xl">{profileData.emoji}</span>}
                        </h1>
                        <p className="text-blue-500 text-sm font-semibold tracking-wide" data-testid="text-profile-username">{profileData.username}</p>
                    </div>
                </motion.div>

                {/* Stats - Glassmorphism Design */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4 }} 
                    className="grid grid-cols-4 gap-3 mb-6"
                >
                    <motion.div 
                        whileHover={{ scale: 1.08, y: -4 }} 
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/70 backdrop-blur-md rounded-2xl p-4 text-center shadow-xl border border-white/60 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 group-hover:from-blue-400/20 group-hover:to-blue-600/20 transition-all duration-300" />
                        <div className="relative z-10">
                            <div className="font-black text-2xl bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent" data-testid="text-posts-count">{profileData.stats.posts}</div>
                            <div className="text-xs text-blue-700 font-semibold mt-1">コース</div>
                        </div>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.08, y: -4 }} 
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/70 backdrop-blur-md rounded-2xl p-4 text-center shadow-xl border border-white/60 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-700/10 group-hover:from-blue-500/20 group-hover:to-blue-700/20 transition-all duration-300" />
                        <div className="relative z-10">
                            <div className="font-black text-2xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" data-testid="text-likes-count">{profileData.stats.likes}</div>
                            <div className="text-xs text-blue-700 font-semibold mt-1">いいね</div>
                        </div>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.08, y: -4 }} 
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/70 backdrop-blur-md rounded-2xl p-4 text-center shadow-xl border border-white/60 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 group-hover:from-blue-600/20 group-hover:to-blue-600/20 transition-all duration-300" />
                        <div className="relative z-10">
                            <div className="font-black text-2xl bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent" data-testid="text-followers-count">{profileData.stats.followers}</div>
                            <div className="text-xs text-blue-800 font-semibold mt-1">フォロワー</div>
                        </div>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.08, y: -4 }} 
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/70 backdrop-blur-md rounded-2xl p-4 text-center shadow-xl border border-white/60 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-700/10 group-hover:from-blue-500/20 group-hover:to-blue-700/20 transition-all duration-300" />
                        <div className="relative z-10">
                            <div className="font-black text-2xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" data-testid="text-following-count">{profileData.stats.following}</div>
                            <div className="text-xs text-blue-800 font-semibold mt-1">フォロー</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bio - Elegant Card */}
                {profileData.bio && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-2xl p-5 shadow-lg border-2 border-blue-100 relative overflow-hidden">
                        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center mb-2">
                                <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                                <span className="text-xs font-bold text-blue-700">プロフィール</span>
                            </div>
                            <p className="text-blue-900 text-sm font-medium whitespace-pre-line leading-relaxed" data-testid="text-bio">{profileData.bio}</p>
                        </div>
                    </motion.div>
                )}

                {/* Genre Rankings */}
                {profileData.genreRankings && profileData.genreRankings.length > 0 && showRankings && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-5 mb-4 shadow-xl border-2 border-blue-200 relative overflow-hidden">
                        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <h3 className="font-bold text-blue-900 mb-3 text-lg flex items-center">
                                <Sparkles className="w-5 h-5 mr-2" />
                                ジャンル別ランキング(日間)
                            </h3>
                            <div className="space-y-2">
                                {profileData.genreRankings.map((item, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + index * 0.05 }} className="flex justify-between items-center bg-gradient-to-r from-blue-50/80 to-blue-100/80 rounded-lg p-2">
                                        <span className="text-blue-900 font-medium" data-testid={`text-genre-${index}`}>{item.genre}</span>
                                        <span className="font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent" data-testid={`text-rank-${index}`}>{item.rank}位</span>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {isOwnProfile && (
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-200">
                                    <span className="text-sm text-blue-800 font-medium">ジャンル別ランキング(日間)を他ユーザーに表示する</span>
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowRankings(!showRankings)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showRankings ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-blue-200 to-blue-300'}`} data-testid="button-toggle-rankings">
                                        <motion.span animate={{ x: showRankings ? 20 : 4 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="inline-block h-4 w-4 rounded-full bg-white shadow-md" />
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Subscription Plans - Premium Cards */}
                {subscriptionPlans.length > 0 && (
                    <div className="space-y-4 mb-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: 0.75 }} 
                            className="flex items-center mb-4"
                        >
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mr-3">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-black text-2xl bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">サブスクリプションプラン</h3>
                        </motion.div>

                        {displayedPlans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePlanConfirm(plan.id)}
                                className={`bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-2 ${
                                    plan.isRecommended ? 'border-blue-400' : 'border-white/50'
                                } cursor-pointer relative overflow-hidden group`}
                                data-testid={`subscription-plan-${plan.id}`}
                            >
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 90, 180, 270, 360]
                                    }} 
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                                    className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-blue-400/20 rounded-full blur-2xl" 
                                />
                                {plan.isRecommended && (
                                    <motion.div 
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg flex items-center"
                                    >
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        おすすめ
                                    </motion.div>
                                )}
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-black text-xl bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent flex items-center mb-2">
                                                {plan.emoji && <span className="mr-2 text-2xl">{plan.emoji}</span>}
                                                {plan.title}
                                            </h4>
                                            <div className="flex items-center text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full inline-flex">
                                                <Video className="w-3 h-3 mr-1" />
                                                {plan.posts}コース
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right">
                                                <div className="font-black text-3xl bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">{calculateTotalPrice(plan.price)}</div>
                                                <div className="text-xs text-blue-500 font-medium mt-1">税・手数料込</div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg text-sm"
                                                data-testid={`button-subscribe-${plan.id}`}
                                            >
                                                加入する
                                            </motion.button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-blue-900 leading-relaxed mt-3">{plan.description}</p>
                                </div>
                            </motion.div>
                        ))}

                        {subscriptionPlans.length > 3 && !showAllPlans && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowAllPlans(true)}
                                className="w-full bg-white text-blue-600 border-2 border-blue-300 py-3 rounded-xl font-bold shadow-md hover:bg-blue-50 transition-colors"
                                data-testid="button-show-all-plans"
                            >
                                すべてのプランを見る
                            </motion.button>
                        )}
                    </div>
                )}

                {/* Posts Section */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-blue-900 text-lg flex items-center">
                            <Video className="w-5 h-5 mr-2" />
                            コース
                        </h3>
                        <div className="flex space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleFilterChange('all')}
                                className={`px-4 py-2 rounded-full text-sm font-bold ${
                                    selectedFilter === 'all'
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                        : 'bg-white text-blue-600 border border-blue-300'
                                }`}
                                data-testid="button-filter-all"
                            >
                                すべて
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleFilterChange('video')}
                                className={`px-4 py-2 rounded-full text-sm font-bold ${
                                    selectedFilter === 'video'
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                        : 'bg-white text-blue-600 border border-blue-300'
                                }`}
                                data-testid="button-filter-video"
                            >
                                <Video className="w-4 h-4 inline mr-1" />
                                動画
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleFilterChange('image')}
                                className={`px-4 py-2 rounded-full text-sm font-bold ${
                                    selectedFilter === 'image'
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                        : 'bg-white text-blue-600 border border-blue-300'
                                }`}
                                data-testid="button-filter-image"
                            >
                                <Image className="w-4 h-4 inline mr-1" />
                                画像
                            </motion.button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    {contentData.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {contentData.map((content, index) => (
                                <motion.div
                                    key={content.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => handleContentClick(content.id)}
                                    className="relative aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden cursor-pointer shadow-md"
                                    data-testid={`content-${content.id}`}
                                >
                                    {content.type === 'video' ? (
                                        <video
                                            src={content.thumbnail}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                            preload="metadata"
                                        />
                                    ) : (
                                        <img
                                            src={content.thumbnail || 'https://via.placeholder.com/300'}
                                            alt="Content"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {content.type === 'video' && (
                                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                                            {content.duration}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                                        <div className="flex items-center space-x-3 text-white text-xs">
                                            <span className="flex items-center">
                                                <Heart className="w-3 h-3 mr-1" />
                                                {content.likes}
                                            </span>
                                            <span className="flex items-center">
                                                <MessageCircle className="w-3 h-3 mr-1" />
                                                {content.comments}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Video className="w-16 h-16 mx-auto text-blue-300 mb-4" />
                            </motion.div>
                            <p className="text-blue-600 font-medium">まだコースがありません</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">プロフィールを共有</h3>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowShareModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                            <div className="p-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCopyLink}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center space-x-2"
                                    data-testid="button-copy-link"
                                >
                                    <Copy className="w-5 h-5" />
                                    <span>リンクをコピー</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Plan Subscription Modal - Payment Details */}
            <AnimatePresence>
                {showPlanModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
                        onClick={() => setShowPlanModal(null)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-3xl shadow-2xl w-full overflow-y-auto max-h-[85vh] pb-24"
                        >
                            {(() => {
                                const plan = subscriptionPlans.find(p => p.id === showPlanModal);
                                if (!plan) return null;
                                
                                const priceMatch = plan.price.match(/\d+/);
                                const basePrice = priceMatch ? parseInt(priceMatch[0]) : 0;
                                const tax = Math.floor(basePrice * 0.10);
                                const platformFee = Math.floor(basePrice * 0.10);
                                const total = basePrice + tax + platformFee;
                                
                                return (
                                    <>
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xl font-bold">{plan.emoji} {plan.title}</h3>
                                                <button onClick={() => setShowPlanModal(null)} className="text-white">
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <p className="text-sm opacity-90">{plan.description}</p>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="text-lg font-bold text-gray-800 mb-4">お支払い詳細</h4>
                                            
                                            {/* Price Breakdown */}
                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">プラン料金</span>
                                                    <span className="font-bold text-gray-800">¥{basePrice.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">消費税（10%）</span>
                                                    <span className="font-bold text-gray-800">¥{tax.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">購入手数料（10%）</span>
                                                    <span className="font-bold text-gray-800">¥{platformFee.toLocaleString()}</span>
                                                </div>
                                                <div className="border-t-2 border-blue-200 pt-3 mt-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg font-bold text-gray-800">お支払い合計</span>
                                                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">¥{total.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stripe Payment Form */}
                                            {clientSecret ? (
                                                <Elements
                                                    stripe={stripePromise}
                                                    options={{
                                                        clientSecret,
                                                        appearance: {
                                                            theme: 'stripe',
                                                            variables: {
                                                                colorPrimary: '#3b82f6',
                                                                colorBackground: '#ffffff',
                                                                colorText: '#1f2937',
                                                                colorDanger: '#ef4444',
                                                                borderRadius: '12px',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <PaymentForm
                                                        plan={{ ...plan, total, creatorId: profileData.id }}
                                                        onSuccess={handlePaymentSuccess}
                                                        onCancel={handlePaymentCancel}
                                                    />
                                                </Elements>
                                            ) : (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNavigationWithCreator active="profile" />
        </div>
    );
};

export default ProfilePage;
