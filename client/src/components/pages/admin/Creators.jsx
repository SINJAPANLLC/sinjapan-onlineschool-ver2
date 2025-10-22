import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { 
  Crown,
  Search, 
  Ban, 
  UserCheck, 
  Shield,
  Clock,
  CheckCircle,
  Eye,
  RefreshCw,
  Download,
  XCircle,
  Users,
  DollarSign,
  FileText
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

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    banned: 0,
    active: 0
  });

  const statusOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'active', label: 'アクティブ' },
    { value: 'banned', label: 'BAN済み' },
    { value: 'pending', label: '承認待ち' },
    { value: 'suspended', label: '一時停止' }
  ];

  const verificationOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'verified', label: '認証済み' },
    { value: 'pending', label: '認証待ち' },
    { value: 'rejected', label: '認証拒否' }
  ];

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = () => {
    const mockInstructors = [
      { 
        id: 1, 
        name: "田中花子", 
        email: "hanako@example.com",
        status: "active", 
        verification: "verified",
        joinDate: "2024-01-15",
        lastLogin: "2024-01-20",
        courses: 45,
        followers: 1250,
        revenue: 125000,
        rating: 4.8,
        category: "美容・ファッション"
      },
      { 
        id: 2, 
        name: "佐藤太郎", 
        email: "taro@example.com",
        status: "pending", 
        verification: "pending",
        joinDate: "2024-01-18",
        lastLogin: "2024-01-19",
        courses: 12,
        followers: 89,
        revenue: 0,
        rating: 4.2,
        category: "テクノロジー"
      },
      { 
        id: 3, 
        name: "山田美咲", 
        email: "misaki@example.com",
        status: "banned", 
        verification: "verified",
        joinDate: "2024-01-10",
        lastLogin: "2024-01-15",
        courses: 23,
        followers: 456,
        revenue: 0,
        rating: 3.1,
        category: "エンターテイメント"
      }
    ];
    
    setInstructors(mockInstructors);
    setFilteredInstructors(mockInstructors);
    
    setStats({
      total: mockInstructors.length,
      verified: mockInstructors.filter(c => c.verification === 'verified').length,
      pending: mockInstructors.filter(c => c.status === 'pending').length,
      banned: mockInstructors.filter(c => c.status === 'banned').length,
      active: mockInstructors.filter(c => c.status === 'active').length
    });
    
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...instructors];

    if (searchTerm) {
      filtered = filtered.filter(instructor =>
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(instructor => instructor.status === filterStatus);
    }

    if (filterVerification !== 'all') {
      filtered = filtered.filter(instructor => instructor.verification === filterVerification);
    }

    setFilteredInstructors(filtered);
  }, [instructors, searchTerm, filterStatus, filterVerification]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadInstructors();
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'banned': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVerificationColor = (verification) => {
    switch (verification) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return <AdminLoadingState message="講師データを読み込み中..." />;
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="講師管理"
        description="講師アカウントの管理、認証、ステータス確認を行います"
        icon={Crown}
        actions={
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <AdminStatsCard
          title="総講師数"
          value={<AnimatedNumber value={stats.total} />}
          icon={Users}
          color="blue"
        />
        <AdminStatsCard
          title="認証済み"
          value={<AnimatedNumber value={stats.verified} />}
          icon={CheckCircle}
          color="green"
        />
        <AdminStatsCard
          title="承認待ち"
          value={<AnimatedNumber value={stats.pending} />}
          icon={Clock}
          color="orange"
        />
        <AdminStatsCard
          title="アクティブ"
          value={<AnimatedNumber value={stats.active} />}
          icon={UserCheck}
          color="purple"
        />
        <AdminStatsCard
          title="BAN済み"
          value={<AnimatedNumber value={stats.banned} />}
          icon={Ban}
          color="pink"
        />
      </div>

      <AdminContentCard title="検索・フィルター">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="講師を検索..."
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
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="select-verification"
            >
              {verificationOptions.map(verification => (
                <option key={verification.value} value={verification.value}>
                  {verification.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </AdminContentCard>

      <AdminTableContainer>
        {filteredInstructors.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  講師
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  認証状態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  統計
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  売上
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  登録日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructors.map((instructor, index) => (
                <motion.tr 
                  key={instructor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors"
                  data-testid={`row-instructor-${instructor.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold ring-2 ring-blue-100">
                          {instructor.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {instructor.name}
                        </div>
                        <div className="text-sm text-gray-500">{instructor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(instructor.status)}`}>
                      {statusOptions.find(s => s.value === instructor.status)?.label || instructor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationColor(instructor.verification)}`}>
                      {verificationOptions.find(v => v.value === instructor.verification)?.label || instructor.verification}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="flex items-center text-gray-600">
                          <FileText className="w-3 h-3 mr-1" />
                          <span className="font-semibold text-gray-900">{instructor.courses}</span>
                        </span>
                        <span className="flex items-center text-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          <span className="font-semibold text-gray-900">{instructor.followers}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      {instructor.revenue.toLocaleString()}円
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(instructor.joinDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      data-testid={`button-view-${instructor.id}`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>詳細</span>
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <AdminEmptyState
            icon={Crown}
            title="講師が見つかりません"
            description="検索条件を変更してください"
          />
        )}
      </AdminTableContainer>
    </AdminPageContainer>
  );
}
