import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  DollarSign, 
  FileText, 
  CheckCircle,
  Loader2,
  Star,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CreatePlanPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: [],
    isRecommended: false
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'プラン名を入力してください';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = '有効な金額を入力してください';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'プラン説明を入力してください';
    }
    
    if (formData.features.length === 0) {
      newErrors.features = '少なくとも1つの特典を追加してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!currentUser) {
      alert('ログインが必要です');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Firestoreにプランを保存
      const plansRef = collection(db, 'users', currentUser.uid, 'subscriptionPlans');
      await addDoc(plansRef, {
        name: formData.name,
        price: `¥${parseInt(formData.price).toLocaleString()}/月`,
        priceValue: parseInt(formData.price),
        description: formData.description,
        features: formData.features,
        isRecommended: formData.isRecommended,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        subscribers: 0,
        revenue: 0
      });
      
      alert('✅ サブスクプランを作成しました！');
      navigate('/active-plans');
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('プランの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center z-10 shadow-lg"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="text-white mr-4 p-2 hover:bg-white/20 rounded-full"
          data-testid="button-back"
        >
          <ArrowLeft size={24} />
        </motion.button>
        <div className="flex items-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-7 h-7 text-white mr-3" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">新規プラン作成</h1>
        </div>
      </motion.div>

      <div className="p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* プラン名 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-100"
          >
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              プラン名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例: ベーシックプラン"
              className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              }`}
              data-testid="input-plan-name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-2">{errors.name}</p>
            )}
          </motion.div>

          {/* 月額料金 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-100"
          >
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              月額料金（円） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1980"
              min="0"
              className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                errors.price ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              }`}
              data-testid="input-plan-price"
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-2">{errors.price}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              ※ 表示価格に消費税10%とプラットフォーム手数料10%が加算されます
            </p>
          </motion.div>

          {/* プラン説明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-100"
          >
            <label className="block text-sm font-bold text-gray-700 mb-2">
              プラン説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="このプランの内容を説明してください"
              rows={4}
              className={`w-full p-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
                errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              }`}
              data-testid="input-plan-description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-2">{errors.description}</p>
            )}
          </motion.div>

          {/* プラン特典 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-100"
          >
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Star className="inline w-4 h-4 mr-1" />
              プラン特典 <span className="text-red-500">*</span>
            </label>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="特典を入力してEnter"
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="input-new-feature"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddFeature}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
                data-testid="button-add-feature"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            <AnimatePresence>
              {formData.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {formData.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200"
                      data-testid={`feature-item-${index}`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                        data-testid={`button-remove-feature-${index}`}
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            {errors.features && (
              <p className="text-red-600 text-sm mt-2">{errors.features}</p>
            )}
          </motion.div>

          {/* おすすめプランとして設定 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-100"
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isRecommended"
                checked={formData.isRecommended}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                data-testid="checkbox-recommended"
              />
              <span className="text-gray-700 font-medium">
                このプランをおすすめプランとして設定する
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-2 ml-8">
              おすすめプランはプロフィールページで目立つように表示されます
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            data-testid="button-submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                作成中...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                プランを作成
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanPage;
