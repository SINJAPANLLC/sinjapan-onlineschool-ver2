import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Star,
  GraduationCap,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { db } from '../../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AdminPageContainer, AdminPageHeader, AdminLoadingState } from './AdminPageContainer';

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

const StatCard = ({ title, value, trend, trendValue, icon: Icon, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
           style={{ background: gradient }}></div>
      
      <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br rounded-full" style={{ background: gradient }}></div>
        </div>

        <div className="relative flex items-start justify-between mb-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                 style={{ background: gradient }}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>

          {trend && (
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
              trend === 'up' 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        <div className="relative">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            <AnimatedNumber value={value} />
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
      </div>
    </motion.div>
  );
};

const ActivityCard = ({ activity, index }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'course_created':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'enrollment':
        return <Award className="w-5 h-5 text-purple-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registration':
        return 'from-blue-400 to-blue-600';
      case 'course_created':
        return 'from-green-400 to-green-600';
      case 'enrollment':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getActivityColor(activity.type)} shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
        {getActivityIcon(activity.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
      </div>
      
      <div className="text-xs font-medium text-gray-400 flex-shrink-0">
        {activity.timeAgo}
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeStudents: 0,
    newStudentsToday: 0,
    pendingReports: 0,
    verifiedInstructors: 0,
    totalEnrollments: 0,
    averageRating: 0,
    completionRate: 0,
    monthlyRevenue: 0
  });

  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([
    {
      type: 'user_registration',
      title: '新規学生登録',
      description: '山田太郎さんが登録しました',
      timeAgo: '5分前'
    },
    {
      type: 'course_created',
      title: '新しいコース作成',
      description: '佐藤花子講師が「React入門」を作成',
      timeAgo: '15分前'
    },
    {
      type: 'enrollment',
      title: 'コース受講開始',
      description: '田中一郎さんが「JavaScript基礎」を受講開始',
      timeAgo: '30分前'
    },
    {
      type: 'user_registration',
      title: '新規学生登録',
      description: '鈴木美咲さんが登録しました',
      timeAgo: '1時間前'
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        let studentCount = 0;
        let instructorCount = 0;
        
        usersSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.isCreator || data.isInstructor) {
            instructorCount++;
          } else {
            studentCount++;
          }
        });

        const coursesRef = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesRef);
        
        let totalRevenue = 0;
        let totalEnrollments = 0;
        let totalRating = 0;
        let ratingCount = 0;
        
        coursesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const students = data.students || 0;
          const price = data.price || 0;
          totalEnrollments += students;
          totalRevenue += students * price;
          
          if (data.rating && data.rating > 0) {
            totalRating += data.rating;
            ratingCount++;
          }
        });

        const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

        setStats({
          totalStudents: studentCount,
          totalInstructors: instructorCount,
          totalCourses: coursesSnapshot.size,
          totalRevenue,
          activeStudents: Math.floor(studentCount * 0.7),
          newStudentsToday: Math.floor(studentCount * 0.05),
          pendingReports: 3,
          verifiedInstructors: Math.floor(instructorCount * 0.8),
          totalEnrollments,
          averageRating: averageRating.toFixed(1),
          completionRate: 78,
          monthlyRevenue: Math.floor(totalRevenue * 0.3)
        });

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <AdminLoadingState />;
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="ダッシュボード"
        description="SIN JAPAN ONLINE SCHOOL 管理システム"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="総学生数"
          value={stats.totalStudents}
          trend="up"
          trendValue="+12%"
          icon={Users}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          delay={0}
        />
        <StatCard
          title="総講師数"
          value={stats.totalInstructors}
          trend="up"
          trendValue="+8%"
          icon={GraduationCap}
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          delay={0.1}
        />
        <StatCard
          title="総コース数"
          value={stats.totalCourses}
          trend="up"
          trendValue="+15%"
          icon={BookOpen}
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          delay={0.2}
        />
        <StatCard
          title="総収益"
          value={stats.totalRevenue}
          trend="up"
          trendValue="+20%"
          icon={DollarSign}
          gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          delay={0.3}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-md flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">平均評価</p>
          <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
          <p className="text-xs text-gray-500 mt-2">5点満点中</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-md flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">完了率</p>
          <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
          <p className="text-xs text-gray-500 mt-2">平均コース完了率</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-md flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">総受講数</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalEnrollments}</p>
          <p className="text-xs text-gray-500 mt-2">延べ受講者数</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">今月の収益</p>
          <p className="text-3xl font-bold text-gray-900">¥{stats.monthlyRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">月間売上</p>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">最近のアクティビティ</h2>
          <Activity className="w-6 h-6 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          {recentActivities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} index={index} />
          ))}
        </div>
      </motion.div>
    </AdminPageContainer>
  );
}
