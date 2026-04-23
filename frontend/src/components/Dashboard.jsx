import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from './Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const [hotspots, setHotspots] = useState([]);
  const [overview, setOverview] = useState({
    totalHotspots: 0,
    urgentHotspots: 0,
    favoriteCount: 0,
    keywordCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get('/hotspots/overview');
        setOverview(response.data);
      } catch (error) {
        console.error('获取概览数据失败:', error);
      }
    };

    const fetchHotspots = async () => {
      try {
        const response = await axios.get('/hotspots');
        setHotspots(response.data);
      } catch (error) {
        console.error('获取热点列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
    fetchHotspots();
  }, []);

  const toggleFavorite = async (id) => {
    try {
      const hotspot = hotspots.find(h => h.id === id);
      if (hotspot.is_favorite) {
        await axios.delete(`/hotspots/${id}/favorite`);
      } else {
        await axios.post(`/hotspots/${id}/favorite`);
      }
      setHotspots(hotspots.map(h => 
        h.id === id ? { ...h, is_favorite: !h.is_favorite } : h
      ));
    } catch (error) {
      console.error('操作收藏失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* 概览卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass card-shadow-hover rounded-2xl p-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">总热点</h3>
                <p className="text-3xl font-bold gradient-text">{overview.totalHotspots}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>

          <div className="glass card-shadow-hover rounded-2xl p-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">紧急热点</h3>
                <p className="text-3xl font-bold text-red-600">{overview.urgentHotspots}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-400 to-pink-500 h-2 rounded-full" style={{width: `${Math.min(overview.urgentHotspots / Math.max(overview.totalHotspots, 1) * 100, 100)}%`}}></div>
              </div>
            </div>
          </div>

          <div className="glass card-shadow-hover rounded-2xl p-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">热点收藏</h3>
                <p className="text-3xl font-bold text-green-600">{overview.favoriteCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full" style={{width: `${Math.min(overview.favoriteCount / Math.max(overview.totalHotspots, 1) * 100, 100)}%`}}></div>
              </div>
            </div>
          </div>

          <div className="glass card-shadow-hover rounded-2xl p-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">监控关键词</h3>
                <p className="text-3xl font-bold text-purple-600">{overview.keywordCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 热点列表 */}
        <div className="glass card-shadow-hover rounded-2xl p-6 animate-slide-in-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text mb-4 sm:mb-0">热点列表</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
                时间排序
              </button>
              <button className="px-4 py-2 bg-white/50 text-gray-700 rounded-lg hover:bg-white/80 transition-all duration-300 border border-white/30">
                热度排序
              </button>
              <button className="px-4 py-2 bg-white/50 text-gray-700 rounded-lg hover:bg-white/80 transition-all duration-300 border border-white/30">
                相关性排序
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">标题</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">来源</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">关键词</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">重要性</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">热度</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {hotspots.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-lg">暂无热点数据</p>
                      <p className="text-sm mt-2">开始监控关键词后，热点数据将显示在这里</p>
                    </td>
                  </tr>
                ) : (
                  hotspots.map((hotspot, index) => (
                    <tr key={hotspot.id} className="border-b border-white/20 hover:bg-white/30 transition-all duration-300">
                      <td className="px-6 py-4">
                        <a href={hotspot.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                          {hotspot.title}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-medium">{hotspot.source}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 rounded-full text-xs font-medium">
                          {hotspot.keyword}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          hotspot.importance === '紧急' ? 'bg-red-100 text-red-600 animate-pulse-slow' :
                          hotspot.importance === '高' ? 'bg-orange-100 text-orange-600' :
                          hotspot.importance === '中' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {hotspot.importance}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700 font-medium">{hotspot.hot_score}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${
                              hotspot.hot_score > 80 ? 'bg-red-500' :
                              hotspot.hot_score > 60 ? 'bg-yellow-500' :
                              hotspot.hot_score > 40 ? 'bg-green-500' : 'bg-blue-500'
                            }`} style={{width: `${hotspot.hot_score}%`}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleFavorite(hotspot.id)}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                            hotspot.is_favorite 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                              : 'bg-white/50 text-gray-700 hover:bg-white/80'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${hotspot.is_favorite ? 'text-white' : 'text-gray-400'}`} fill={hotspot.is_favorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{hotspot.is_favorite ? '已收藏' : '收藏'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;