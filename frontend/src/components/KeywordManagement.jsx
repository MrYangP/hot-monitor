import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from './Navbar';

const KeywordManagement = () => {
  const { user } = useAuth();
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get('/keywords');
        setKeywords(response.data);
      } catch (error) {
        console.error('获取关键词列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    try {
      const response = await axios.post('/keywords', { keyword: newKeyword });
      setKeywords([...keywords, response.data]);
      setNewKeyword('');
      setSuccess('关键词添加成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('添加关键词失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditKeyword = async (id) => {
    if (!editingValue.trim()) return;

    try {
      const response = await axios.put(`/keywords/${id}`, { keyword: editingValue });
      setKeywords(keywords.map(k => k.id === id ? response.data : k));
      setEditingKeyword(null);
      setEditingValue('');
      setSuccess('关键词更新成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('更新关键词失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteKeyword = async (id) => {
    if (window.confirm('确定要删除这个关键词吗？')) {
      try {
        await axios.delete(`/keywords/${id}`);
        setKeywords(keywords.filter(k => k.id !== id));
        setSuccess('关键词删除成功');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('删除关键词失败');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(`/keywords/${id}`, { status: !currentStatus });
      setKeywords(keywords.map(k => k.id === id ? response.data : k));
      setSuccess('关键词状态更新成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('更新关键词状态失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSetPriority = async (id, priority) => {
    try {
      const response = await axios.put(`/keywords/${id}`, { priority });
      setKeywords(keywords.map(k => k.id === id ? response.data : k));
      setSuccess('关键词优先级更新成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('更新关键词优先级失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleScan = async () => {
    setScanLoading(true);
    try {
      await axios.post('/keywords/scan');
      setSuccess('扫描完成，正在处理结果');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('扫描失败');
      setTimeout(() => setError(''), 3000);
    } finally {
      setScanLoading(false);
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
        <div className="glass card-shadow-hover rounded-2xl p-6 animate-fade-in-up">
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

          {/* 添加关键词表单和扫描按钮在同一行 */}
          <div className="mb-8">
            <form onSubmit={handleAddKeyword} className="flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-3">添加关键词</label>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="输入要监控的关键词..."
                      className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg flex items-center space-x-2 whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>添加关键词</span>
                  </button>
                </div>
              </div>
              
              <div className="sm:ml-auto">
                <button 
                  onClick={handleScan}
                  disabled={scanLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg flex items-center space-x-2 whitespace-nowrap"
                >
                  {scanLoading ? (
                    <>
                      <div className="loading-spinner w-4 h-4"></div>
                      <span>扫描中...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>立即扫描</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 关键词列表 */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">关键词</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">优先级</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {keywords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <p className="text-lg">暂无关键词</p>
                      <p className="text-sm mt-2">添加关键词后，系统将自动监控相关热点</p>
                    </td>
                  </tr>
                ) : (
                  keywords.map(keyword => (
                    <tr key={keyword.id} className="border-b border-white/20 hover:bg-white/30 transition-all duration-300">
                      <td className="px-6 py-4">
                        {editingKeyword === keyword.id ? (
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="px-3 py-2 bg-white/50 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditKeyword(keyword.id)}
                                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => {
                                  setEditingKeyword(null);
                                  setEditingValue('');
                                }}
                                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300 text-sm"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-800 font-medium">{keyword.keyword}</span>
                            <button
                              onClick={() => {
                                setEditingKeyword(keyword.id);
                                setEditingValue(keyword.keyword);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={keyword.priority}
                          onChange={(e) => handleSetPriority(keyword.id, parseInt(e.target.value))}
                          className="px-3 py-1 bg-white/50 border border-white/30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={1}>低</option>
                          <option value={2}>中</option>
                          <option value={3}>高</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(keyword.id, keyword.status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            keyword.status 
                              ? 'bg-gradient-to-r from-green-100 to-teal-100 text-green-600' 
                              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-600'
                          }`}
                        >
                          {keyword.status ? '启用' : '禁用'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteKeyword(keyword.id)}
                          className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-md hover:from-red-200 hover:to-pink-200 transition-all duration-300 text-sm flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>删除</span>
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

export default KeywordManagement;