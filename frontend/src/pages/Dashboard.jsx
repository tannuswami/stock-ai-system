import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';
import StockCard from '../components/StockCard';
import TradingChart from '../components/TradingChart';
import { useGetStocksQuery } from '../redux/services/stockApi';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: topStocks, isLoading } = useGetStocksQuery({ limit: 20 });
  
  const popularStocks = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'RELIANCE.NS', 'TCS.NS'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Market Dashboard
        </h1>
        <p className="text-xl text-gray-300">Real-time insights & AI predictions</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <motion.div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Market Index</p>
              <p className="text-3xl font-bold text-white">+2.34%</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Portfolio</p>
              <p className="text-3xl font-bold text-white">$24,567</p>
            </div>
          </div>
        </motion.div>
        
        {/* More stat cards */}
      </div>

      {/* Search & Popular Stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Search Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div className="relative mb-8">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks (AAPL, TSLA...)"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Popular Stocks</h3>
              <div className="space-y-3">
                {popularStocks.map(symbol => (
                  <StockCard key={symbol} symbol={symbol} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <TradingChart 
            symbol="NIFTY 50" 
            timeframe="1d" 
            data={topStocks?.[0]?.chart_data || []}
          />
        </motion.div>
      </div>

      {/* Top Movers */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold text-white mb-6">Top Movers</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {topStocks?.map((stock, idx) => (
            <StockCard key={idx} {...stock} />
          )) || Array(6).fill().map((_, idx) => (
            <div key={idx} className="h-48 bg-white/5 backdrop-blur-xl rounded-2xl animate-pulse" />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;