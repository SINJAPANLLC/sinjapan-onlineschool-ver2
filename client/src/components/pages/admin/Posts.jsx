import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";
import { db } from "../../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, getDoc, where } from "firebase/firestore";
import { 
  FileText, 
  Search, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Clock,
  Heart,
  MessageCircle,
  RefreshCw,
  AlertTriangle,
  Image,
  Video
} from 'lucide-react';
import { 
  AdminPageContainer, 
  AdminPageHeader, 
  AdminStatsCard, 
  AdminContentCard, 
  AdminTableContainer, 
  AdminEmptyState, 
  AdminLoadingState 
} from './AdminPageContainer';

// カウントアップアニメーションコンポーネント
const AnimatedNumber = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setDisplayValue(Math.floor(value * progress));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        private: 0,
        images: 0,
        videos: 0
    });
    const { t } = useTranslation();

    const statusOptions = [
        { value: 'all', label: 'すべて' },
        { value: 'Public', label: '公開' },
        { value: 'Private', label: '非公開' }
    ];

    const typeOptions = [
        { value: 'all', label: 'すべて' },
        { value: 'image', label: '画像' },
        { value: 'video', label: '動画' }
    ];

    // 検索・フィルター処理
    useEffect(() => {
        let filtered = courses;

        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.userName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(course => course.status === filterStatus);
        }

        if (filterType !== 'all') {
            if (filterType === 'image') {
                filtered = filtered.filter(course => course.hasImages);
            } else if (filterType === 'video') {
                filtered = filtered.filter(course => course.hasVideos);
            }
        }

        setFilteredCourses(filtered);
    }, [courses, searchTerm, filterStatus, filterType]);

    // 統計を更新
    useEffect(() => {
        const newStats = {
            total: courses.length,
            published: courses.filter(p => p.status === 'Public').length,
            private: courses.filter(p => p.status === 'Private').length,
            images: courses.filter(p => p.hasImages).length,
            videos: courses.filter(p => p.hasVideos).length
        };
        setStats(newStats);
    }, [courses]);

    // Fetch all courses from Firebase
    const fetchCourses = async () => {
        try {
            setLoading(true);
            setIsRefreshing(true);
            
            const coursesQuery = query(
                collection(db, 'courses'),
                orderBy('createdAt', 'desc')
            );
            
            const coursesSnapshot = await getDocs(coursesQuery);
            
            // Step 1: ユニークなuserIdを収集
            const userIds = [...new Set(
                coursesSnapshot.docs
                    .map(doc => doc.data().userId)
                    .filter(userId => userId)
            )];
            
            // Step 2: ユーザーデータをバッチで取得（N+1問題を回避）
            const userDataMap = new Map();
            
            // Firestoreの制限により、一度に最大10個のIDでクエリできる
            const BATCH_SIZE = 10;
            for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
                const batchIds = userIds.slice(i, i + BATCH_SIZE);
                const usersQuery = query(
                    collection(db, 'users'),
                    where('__name__', 'in', batchIds)
                );
                
                try {
                    const usersSnapshot = await getDocs(usersQuery);
                    usersSnapshot.docs.forEach(userDoc => {
                        const userData = userDoc.data();
                        userDataMap.set(userDoc.id, userData.displayName || userData.name || 'Unknown User');
                    });
                } catch (batchError) {
                    console.warn('バッチクエリエラー:', batchError);
                }
            }
            
            // Step 3: コースデータを処理
            const coursesData = coursesSnapshot.docs.map(courseDoc => {
                const courseData = courseDoc.data();
                const userName = courseData.userId ? 
                    (userDataMap.get(courseData.userId) || 'Unknown User') : 
                    'Unknown User';
                
                return {
                    id: courseDoc.id,
                    title: courseData.explanation || courseData.title || 'Untitled Course',
                    userId: courseData.userId || 'Unknown',
                    userName: userName,
                    status: courseData.isPublic !== false ? 'Public' : 'Private',
                    isPublic: courseData.isPublic !== false,
                    createdAt: courseData.createdAt || null,
                    likes: courseData.likes || 0,
                    comments: courseData.comments || 0,
                    views: courseData.views || 0,
                    filesCount: courseData.files ? courseData.files.length : 0,
                    hasImages: courseData.files ? courseData.files.some(f => f.type && f.type.startsWith('image/')) : false,
                    hasVideos: courseData.files ? courseData.files.some(f => f.type && f.type.startsWith('video/')) : false,
                    thumbnailUrl: courseData.files && courseData.files.length > 0 ? 
                        (courseData.files[0].url || courseData.files[0].secure_url || null) : null
                };
            });
            
            setCourses(coursesData);
            setFilteredCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleToggleVisibility = async (courseId, currentStatus) => {
        try {
            const courseRef = doc(db, 'courses', courseId);
            const newStatus = !currentStatus;
            
            await updateDoc(courseRef, {
                isPublic: newStatus,
                lastModified: new Date().toISOString()
            });
            
            setCourses(courses.map(course => 
                course.id === courseId 
                    ? { ...course, isPublic: newStatus, status: newStatus ? 'Public' : 'Private' }
                    : course
            ));
        } catch (error) {
            console.error('Error updating course visibility:', error);
            alert('Failed to update course visibility.');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('このコースを削除しますか？この操作は取り消せません。')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'courses', courseId));
            setCourses(courses.filter(course => course.id !== courseId));
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course.');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = dateString.seconds ? new Date(dateString.seconds * 1000) : new Date(dateString);
            return date.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Public': return 'text-green-600 bg-green-100';
            case 'Private': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return <AdminLoadingState message="コースデータを読み込み中..." />;
    }

    return (
        <AdminPageContainer>
            {/* ページヘッダー */}
            <AdminPageHeader
                title="コース管理"
                description="コースの管理、公開/非公開、削除を行います"
                icon={FileText}
                actions={
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={fetchCourses}
                            disabled={isRefreshing}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            data-testid="button-refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span className="font-medium">更新</span>
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                            data-testid="button-export"
                        >
                            <Download className="w-4 h-4" />
                            <span className="font-medium">エクスポート</span>
                        </motion.button>
                    </>
                }
            />

            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <AdminStatsCard
                    title="総コース数"
                    value={<AnimatedNumber value={stats.total} />}
                    icon={FileText}
                    color="blue"
                />
                <AdminStatsCard
                    title="公開"
                    value={<AnimatedNumber value={stats.published} />}
                    icon={CheckCircle}
                    color="green"
                />
                <AdminStatsCard
                    title="非公開"
                    value={<AnimatedNumber value={stats.private} />}
                    icon={XCircle}
                    color="orange"
                />
                <AdminStatsCard
                    title="画像"
                    value={<AnimatedNumber value={stats.images} />}
                    icon={Image}
                    color="purple"
                />
                <AdminStatsCard
                    title="動画"
                    value={<AnimatedNumber value={stats.videos} />}
                    icon={Video}
                    color="pink"
                />
            </div>

            {/* フィルターと検索 */}
            <AdminContentCard title="検索・フィルター">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="コースを検索..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                data-testid="input-search"
                            />
                        </div>
                    </div>

                    <div className="md:w-48">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-testid="select-status"
                        >
                            {statusOptions.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:w-48">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-testid="select-type"
                        >
                            {typeOptions.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </AdminContentCard>

            {/* コース一覧テーブル */}
            <AdminTableContainer>
                {filteredCourses.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    コース
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    作成者
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ステータス
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    統計
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    コース日
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCourses.map((course, index) => (
                                <motion.tr 
                                    key={course.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="hover:bg-blue-50 transition-colors"
                                    data-testid={`row-course-${course.id}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {course.thumbnailUrl && (
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img 
                                                        className="h-12 w-12 rounded-lg object-cover ring-2 ring-blue-100" 
                                                        src={course.thumbnailUrl} 
                                                        alt={course.title}
                                                    />
                                                </div>
                                            )}
                                            <div className={course.thumbnailUrl ? "ml-4" : ""}>
                                                <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                                                    {course.title}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {course.filesCount} ファイル
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{course.userName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(course.status)}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3 text-xs">
                                            <span className="flex items-center space-x-1">
                                                <Heart className="w-3 h-3 text-red-500" />
                                                <span className="text-gray-900 font-semibold">{course.likes || 0}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <MessageCircle className="w-3 h-3 text-blue-500" />
                                                <span className="text-gray-900 font-semibold">{course.comments || 0}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(course.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleToggleVisibility(course.id, course.isPublic)}
                                                className="text-blue-600 hover:text-blue-900"
                                                data-testid={`button-toggle-${course.id}`}
                                            >
                                                {course.isPublic ? <Eye className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDeleteCourse(course.id)}
                                                className="text-red-600 hover:text-red-900"
                                                data-testid={`button-delete-${course.id}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <AdminEmptyState
                        icon={FileText}
                        title="コースが見つかりません"
                        description="検索条件を変更してください"
                    />
                )}
            </AdminTableContainer>
        </AdminPageContainer>
    );
}
