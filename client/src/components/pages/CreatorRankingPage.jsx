import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Trophy, Medal, Star, TrendingUp, Users, Heart, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';

const CreatorRankingPage = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  const periods = [
    { id: 'daily', name: '日間' },
    { id: 'weekly', name: '週間' },
    { id: 'monthly', name: '月間' },
    { id: 'yearly', name: '年間' }
  ];

  useEffect(() => {
    const creatorsQuery = query(
      collection(db, 'users'),
      orderBy('followers', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(creatorsQuery, (snapshot) => {
      const creatorsData = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          rank: index + 1,
          id: doc.id,
          name: data.displayName || data.name || '名無しさん',
          avatar: data.photoURL || data.avatar || '/logo-school.jpg',
          followers: data.followers || 0,
          likes: data.totalLikes || 0,
          views: data.totalViews || 0,
          earnings: data.monthlyEarnings || 0,
          isVerified: data.isVerified || false,
          trend: data.trend || 'stable'
        };
      });
      setRankings(creatorsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedPeriod]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    else if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-300 p-6 flex items-center z-10 shadow-lg">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="text-white mr-4 p-2 hover:bg-white/20 rounded-full" data-testid="button-back">
            <ArrowLeft size={24} />
          </motion.button>
          <div className="flex items-center">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
              <Trophy className="w-7 h-7 text-white mr-3" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">講師ランキング</h1>
          </div>
        </motion.div>
        
        <div className="flex items-center justify-center h-96">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
        
        <BottomNavigationWithCreator active="account" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-300 p-6 flex items-center z-10 shadow-lg">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="text-white mr-4 p-2 hover:bg-white/20 rounded-full" data-testid="button-back">
          <ArrowLeft size={24} />
        </motion.button>
        <div className="flex items-center">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
            <Trophy className="w-7 h-7 text-white mr-3" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">講師ランキング</h1>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-xl border-2 border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
            期間選択
          </h3>
          <div className="flex space-x-2">
            {periods.map((period) => (
              <motion.button key={period.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedPeriod(period.id)} className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${selectedPeriod === period.id ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} data-testid={`button-period-${period.id}`}>
                {period.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {rankings.length >= 3 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl p-6 shadow-xl border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
              <Crown className="w-6 h-6 mr-2" />
              トップ3
            </h3>
            <div className="flex items-end justify-center space-x-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center">
                <div className="relative mb-3">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>
                    <img src={rankings[1].avatar} alt={rankings[1].name} className="w-20 h-20 rounded-full mx-auto border-4 border-gray-300 shadow-lg" />
                  </motion.div>
                  <div className="absolute -top-1 -right-1"><Trophy className="w-7 h-7 text-gray-400" /></div>
                </div>
                <h4 className="font-bold text-gray-900 text-lg" data-testid="text-rank-2-name">{rankings[1].name}</h4>
                <p className="text-gray-700 font-semibold" data-testid="text-rank-2-followers">{formatNumber(rankings[1].followers)}</p>
                <div className="mt-2 bg-gray-200 rounded-lg p-2"><p className="text-sm font-bold text-gray-800">2位</p></div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
                <div className="relative mb-3">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <img src={rankings[0].avatar} alt={rankings[0].name} className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400 shadow-xl" />
                  </motion.div>
                  <div className="absolute -top-1 -right-1"><Crown className="w-9 h-9 text-yellow-500" /></div>
                </div>
                <h4 className="font-bold text-gray-900 text-xl" data-testid="text-rank-1-name">{rankings[0].name}</h4>
                <p className="text-gray-700 font-bold" data-testid="text-rank-1-followers">{formatNumber(rankings[0].followers)}</p>
                <div className="mt-2 bg-yellow-200 rounded-lg p-2"><p className="text-sm font-bold text-yellow-900">1位</p></div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                <div className="relative mb-3">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>
                    <img src={rankings[2].avatar} alt={rankings[2].name} className="w-20 h-20 rounded-full mx-auto border-4 border-orange-300 shadow-lg" />
                  </motion.div>
                  <div className="absolute -top-1 -right-1"><Medal className="w-7 h-7 text-orange-500" /></div>
                </div>
                <h4 className="font-bold text-gray-900 text-lg" data-testid="text-rank-3-name">{rankings[2].name}</h4>
                <p className="text-gray-700 font-semibold" data-testid="text-rank-3-followers">{formatNumber(rankings[2].followers)}</p>
                <div className="mt-2 bg-orange-200 rounded-lg p-2"><p className="text-sm font-bold text-orange-800">3位</p></div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">全ランキング</h3>
          {rankings.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-8 text-center shadow-xl border-2 border-blue-100">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">ランキングデータがありません</p>
            </motion.div>
          ) : (
            rankings.map((creator, index) => (
            <motion.div key={creator.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, y: -2 }} className="bg-white rounded-2xl p-5 shadow-lg border-2 border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full border-2 border-blue-200">
                  {getRankIcon(creator.rank)}
                </div>
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}>
                  <img src={creator.avatar} alt={creator.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 shadow-md" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-gray-900 text-lg" data-testid={`text-name-${creator.rank}`}>{creator.name}</h4>
                    {creator.isVerified && <Star className="w-5 h-5 text-blue-500" />}
                    {getTrendIcon(creator.trend)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-600"><Users className="w-4 h-4" /><span data-testid={`text-followers-${creator.rank}`}>{formatNumber(creator.followers)}</span></div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600"><Heart className="w-4 h-4" /><span data-testid={`text-likes-${creator.rank}`}>{formatNumber(creator.likes)}</span></div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600"><Eye className="w-4 h-4" /><span data-testid={`text-views-${creator.rank}`}>{formatNumber(creator.views)}</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent" data-testid={`text-earnings-${creator.rank}`}>{formatCurrency(creator.earnings)}</p>
                  <p className="text-xs text-gray-500 font-medium">月間</p>
                </div>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </div>

      <BottomNavigationWithCreator active="account" />
    </div>
  );
};

export default CreatorRankingPage;
