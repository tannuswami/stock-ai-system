import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStockPrediction } from '../hooks/useStockData';

const StockCard = ({ symbol, price, change, changePercent }) => {
  const { prediction, loading } = useStockPrediction(symbol);

  const getSignalColor = (signal) => {
    switch(signal?.prediction) {
      case 'BUY': return 'bg-emerald-500';
      case 'SELL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
    >
      <Link to={`/stock/${symbol}`} className="block">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{symbol}</h3>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${getSignalColor(prediction)}`}>
            {loading ? '...' : prediction?.prediction || 'HOLD'}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold text-white">${price?.toFixed(2)}</div>
          
          <div className="flex items-center space-x-2">
            {change > 0 ? (
              <ArrowUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <ArrowDown className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-lg font-semibold ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {changePercent?.toFixed(2)}%
            </span>
          </div>
          
          {prediction && (
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <TrendingUp className="w-4 h-4" />
              <span>Confidence: {(prediction.confidence * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default StockCard;