import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  TrendingUp, 
  Globe,
  Search,
  Download,
  Trash2,
  Eye,
  Calendar,
  BarChart3,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { summaryService } from '../services/summaryService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  const loadSummaries = useCallback(async () => {
    try {
      setIsLoading(true);
      const userSummaries = await summaryService.getUserSummaries(user.id);
      setSummaries(userSummaries);
    } catch (error) {
      console.error('Error loading summaries:', error);
      toast.error('Failed to load summaries');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSummaries();
    }
  }, [user, loadSummaries]);

  const filteredSummaries = summaries
    .filter(summary => {
      const matchesSearch = summary.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           summary.summary?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || summary.type === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

  const stats = {
    totalSummaries: summaries.length,
    totalWordsProcessed: summaries.reduce((acc, s) => acc + (s.wordCount?.original || 0), 0),
    averageReduction: summaries.length > 0 ? Math.round(
      summaries.reduce((acc, s) => {
        if (s.wordCount?.original && s.wordCount?.summary) {
          return acc + (1 - s.wordCount.summary / s.wordCount.original);
        }
        return acc;
      }, 0) / summaries.length * 100
    ) : 0,
    languagesUsed: [...new Set(summaries.map(s => s.targetLanguage).filter(Boolean))].length
  };

  const handleDelete = async (id) => {
    try {
      await summaryService.deleteSummary(id);
      setSummaries(prev => prev.filter(s => s.id !== id));
      toast.success('Summary deleted successfully');
    } catch (error) {
      toast.error('Failed to delete summary');
    }
  };

  const handleDownload = (summary) => {
    const content = `Title: ${summary.title || 'Untitled'}\n\nSummary:\n${summary.summary}\n\nOriginal Word Count: ${summary.wordCount?.original || 0}\nSummary Word Count: ${summary.wordCount?.summary || 0}\nCreated: ${format(new Date(summary.createdAt), 'PPP')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(summary.title || 'summary').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded');
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 border border-white/20"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Access Your Dashboard</h1>
          <p className="text-white/80 mb-6">
            Sign in to view your summarization history and analytics.
          </p>
          <button className="btn-primary">
            Sign In to Continue
          </button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white/70">Loading your summaries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user.name}!
          </h1>
          <p className="text-white/80 text-lg">
            Here's your summarization activity and insights
          </p>
        </div>
        <Link to="/" className="btn-primary flex items-center space-x-2 mt-4 md:mt-0">
          <Plus className="h-5 w-5" />
          <span>New Summary</span>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div className="glass rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalSummaries}</p>
              <p className="text-white/70 text-sm">Total Summaries</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalWordsProcessed.toLocaleString()}</p>
              <p className="text-white/70 text-sm">Words Processed</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.averageReduction}%</p>
              <p className="text-white/70 text-sm">Avg. Reduction</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <Globe className="h-8 w-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.languagesUsed}</p>
              <p className="text-white/70 text-sm">Languages Used</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                placeholder="Search summaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="text">Text</option>
              <option value="voice">Voice</option>
              <option value="image">Image</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
          </select>
        </div>
      </motion.div>

      {/* Summaries List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredSummaries.length === 0 ? (
          <div className="glass rounded-xl p-12 border border-white/20 text-center">
            <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No summaries found</h3>
            <p className="text-white/70 mb-6">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by creating your first summary'
              }
            </p>
            {!searchTerm && filterBy === 'all' && (
              <Link to="/" className="btn-primary">
                Create Your First Summary
              </Link>
            )}
          </div>
        ) : (
          filteredSummaries.map((summary, index) => (
            <motion.div
              key={summary.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {summary.title || 'Untitled Summary'}
                    </h3>
                    {summary.type && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full uppercase">
                        {summary.type}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white/80 mb-3 line-clamp-2">
                    {summary.summary || 'No summary available'}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(summary.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    {summary.wordCount && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{summary.wordCount.original} → {summary.wordCount.summary} words</span>
                      </div>
                    )}
                    {summary.language && summary.targetLanguage && (
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{summary.language} → {summary.targetLanguage}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(summary)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Download"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </button>
                  <button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(summary.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;