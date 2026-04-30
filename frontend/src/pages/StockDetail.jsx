import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Activity,
  BarChart3 
} from 'lucide-react';
import TradingChart from '../components/TradingChart';
import { useGetStockDetailQuery } from '../redux/services/stockApi';

const StockDetail = () => {
  const { symbol } = useParams();
  const { data, isLoading } = useGetStockDetailQuery(symbol);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'technical', label: 'Technical', icon: Activity },
    { id: 'prediction', label: 'AI Signals', icon: TrendingUp },
    { id: 'risk', label: 'Risk', icon: Shield },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const basic = data?.basic;
  const prediction = data?.prediction;
  const indicators = data?.indicators;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">{symbol}</h1>
            <p className="text-xl text-gray-400 mb-4">Real-time Analysis & AI Predictions</p>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold text-white mb-2">
              ${basic?.price?.toFixed(2)}
            </div>
            <div className={`text-2xl font-bold ${
              basic?.change > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {basic?.changePercent?.toFixed(2)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
        <TradingChart 
          symbol={symbol} 
          timeframe="1mo" 
          data={basic?.chart_data || []}
        />
      </motion.div>

      {/* Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Panel - Tabs */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* AI Signal Card */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              AI Signal
            </h3>
            <div className="text-center">
              <div className={`text-4xl font-bold px-8 py-4 rounded-xl mb-4 ${
                prediction?.prediction === 'BUY' ? 'bg-emerald-500/30 border-emerald-500/50' :
                prediction?.prediction === 'SELL' ? 'bg-red-500/30 border-red-500/50' :
                'bg-gray-500/30 border-gray-500/50'
              } border-4`}>
                {prediction?.prediction || 'HOLD'}
              </div>
              <div className="text-2xl font-bold text-white">
                {(prediction?.confidence * 100 || 0).toFixed(0)}% Confidence
              </div>
              <div className="text-sm text-gray-300 mt-2">
                Target: ${prediction?.price_target?.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-6">Analysis</h3>
            <div className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/20 border-white/50 font-semibold text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">{basic?.volume?.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Volume</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">${basic?.market_cap?.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Market Cap</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">{basic?.pe_ratio?.toFixed(2)}</div>
              <div className="text-sm text-gray-400">P/E Ratio</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">{basic?.dividend_yield?.toFixed(2)}%</div>
              <div className="text-sm text-gray-400">Dividend</div>
            </div>
          </div>

          {/* Indicators Grid */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Technical Indicators</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { label: 'RSI', value: indicators?.rsi?.toFixed(2), color: indicators?.rsi > 70 ? 'bg-red-500/20' : indicators?.rsi < 30 ? 'bg-emerald-500/20' : 'bg-gray-500/20' },
                { label: 'MACD', value: indicators?.macd?.toFixed(4), color: 'bg-blue-500/20' },
                { label: 'SMA 20', value: `$${indicators?.sma_20?.toFixed(2)}`, color: 'bg-purple-500/20' },
              ].map((indicator, idx) => (
                <div key={idx} className={`p-4 rounded-xl border border-white/20 ${indicator.color}`}>
                  <div className="font-bold text-white">{indicator.value}</div>
                  <div className="text-sm text-gray-400">{indicator.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockDetail;