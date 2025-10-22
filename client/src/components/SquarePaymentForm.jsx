import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CreditCard, Lock } from 'lucide-react';

const SquarePaymentForm = ({ amount, planData, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [squareReady, setSquareReady] = useState(false);
  const [card, setCard] = useState(null);

  useEffect(() => {
    const loadSquareSDK = async () => {
      // Load Square Web Payment SDK
      if (!window.Square) {
        const script = document.createElement('script');
        // サンドボックス環境用のSquare SDKを使用
        script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = initializeSquare;
        script.onerror = () => {
          setErrorMessage('Square SDKの読み込みに失敗しました');
        };
        document.body.appendChild(script);
      } else {
        initializeSquare();
      }
    };

    const initializeSquare = async () => {
      try {
        const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
        
        if (!applicationId) {
          setErrorMessage('Square Application IDが設定されていません');
          return;
        }

        // サンドボックス環境ではlocationIdはオプショナル
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID || undefined;

        const payments = window.Square.payments(applicationId, locationId);
        const cardInstance = await payments.card();
        await cardInstance.attach('#card-container');
        
        setCard(cardInstance);
        setSquareReady(true);
      } catch (error) {
        console.error('Square initialization error:', error);
        setErrorMessage('決済システムの初期化に失敗しました: ' + (error.message || ''));
      }
    };

    loadSquareSDK();

    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!card || !squareReady) {
      setErrorMessage('決済システムの準備ができていません');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Tokenize card
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        const token = result.token;
        
        // Send payment to backend
        const response = await fetch('/api/square-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: token,
            amount: amount,
            planId: planData.planId,
            planName: planData.planName,
            instructorId: planData.creatorId,
            instructorName: planData.instructorName,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          onSuccess(planData);
        } else {
          setErrorMessage(data.error || '決済に失敗しました');
        }
      } else {
        setErrorMessage(result.errors?.[0]?.message || 'カード情報の検証に失敗しました');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('決済処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-square-payment">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">安全な決済</span>
        </div>
        <p className="text-xs text-blue-700">
          すべての決済情報はSquareによって暗号化され、安全に処理されます
        </p>
      </div>

      {/* Square Card Container */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          カード情報
        </label>
        <div 
          id="card-container" 
          className="border-2 border-gray-200 rounded-xl p-4 min-h-[120px] bg-white"
        />
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm"
          data-testid="text-error"
        >
          {errorMessage}
        </motion.div>
      )}

      <div className="flex gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          disabled={isProcessing}
          data-testid="button-cancel-payment"
        >
          キャンセル
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isProcessing || !squareReady}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          data-testid="button-confirm-payment"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              処理中...
            </>
          ) : (
            <>
              {amount.toLocaleString()}円 支払う
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default SquarePaymentForm;
