import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from './Navbar';

const Settings = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    browser: true,
    frequency: '即时'
  });
  const [collectionSettings, setCollectionSettings] = useState({
    frequency: '每小时',
    sources: ['百度', '必应', 'Twitter', 'B站', '知乎', 'DuckDuckGo', 'HackerNews', 'Google']
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userResponse = await axios.get('/auth/me');
        setUserInfo(userResponse.data);

        const configResponse = await axios.get('/config');
        if (configResponse.data) {
          setCollectionSettings({
            frequency: configResponse.data.frequency,
            sources: JSON.parse(configResponse.data.sources)
          });
        }
      } catch (error) {
        console.error('获取设置失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/auth/profile', userInfo);
      setSuccess('个人信息更新成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('更新个人信息失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdateNotificationSettings = async () => {
    try {
      await axios.put('/config/notifications', notificationSettings);
      setSuccess('通知设置更新成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('更新通知设置失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdateCollectionSettings = async () => {
    try {
      await axios.put('/config/collection', {
        frequency: collectionSettings.frequency,
        sources: JSON.stringify(collectionSettings.sources)
      });
      setSuccess('搜集设置更新成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('更新搜集设置失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleSource = (source) => {
    setCollectionSettings(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
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
        <div className="glass card-shadow-hover rounded-2xl p-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold gradient-text mb-6">设置</h2>

          {/* 消息提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-in-left">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg animate-slide-in-left">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {/* 个人信息设置 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              个人信息
            </h3>
            <form onSubmit={handleUpdateUserInfo}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-3 font-medium">用户名</label>
                  <input
                    type="text"
                    value={userInfo.username}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-3 font-medium">邮箱</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>更新个人信息</span>
              </button>
            </form>
          </div>

          {/* 通知设置 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              通知设置
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">邮件通知</span>
                  <p className="text-sm text-gray-500 mt-1">通过邮件接收热点通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.email}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, email: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-green-400 to-teal-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">浏览器推送</span>
                  <p className="text-sm text-gray-500 mt-1">通过浏览器接收实时推送</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.browser}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, browser: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-green-400 to-teal-500"></div>
                </label>
              </div>

              <div className="p-4 bg-white/30 rounded-lg">
                <label className="block text-gray-700 mb-3 font-medium">通知频率</label>
                <select
                  value={notificationSettings.frequency}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="即时">即时通知</option>
                  <option value="每小时">每小时汇总</option>
                  <option value="每天">每日汇总</option>
                </select>
              </div>

              <button
                onClick={handleUpdateNotificationSettings}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>更新通知设置</span>
              </button>
            </div>
          </div>

          {/* 搜集设置 */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              搜集设置
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-white/30 rounded-lg">
                <label className="block text-gray-700 mb-3 font-medium">搜集频率</label>
                <select
                  value={collectionSettings.frequency}
                  onChange={(e) => setCollectionSettings(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="每小时">每小时</option>
                  <option value="每天">每天</option>
                  <option value="每周">每周</option>
                </select>
              </div>

              <div className="p-4 bg-white/30 rounded-lg">
                <label className="block text-gray-700 mb-3 font-medium">搜集来源</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['百度', '必应', 'Twitter', 'B站', '知乎', 'DuckDuckGo', 'HackerNews', 'Google'].map(source => (
                    <div key={source} className="flex items-center">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={collectionSettings.sources.includes(source)}
                          onChange={() => toggleSource(source)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r from-blue-400 to-purple-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">{source}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpdateCollectionSettings}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>更新搜集设置</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;