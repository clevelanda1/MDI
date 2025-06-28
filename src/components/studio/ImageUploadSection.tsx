import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon, Trash2, ChevronDown, Sparkles, CheckCircle2, XCircle, Loader2, Crown, Edit2, RefreshCw, Zap, Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UploadState, DetectedElement } from '../../types/studio';
import Button from '../common/Button';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { ApiUsageService } from '../../services/apiUsageService';

interface ImageUploadSectionProps {
  uploadState: UploadState;
  expandedElements: string[];
  isCreatingProject: boolean;
  hasSelectedQueries: boolean;
  canCreateProject: boolean;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onToggleElement: (elementName: string) => void;
  onUpdateSelectedQuery: (elementName: string, query: string, marketplace: 'amazon' | 'etsy') => void;
  onSelectAllElements: () => void;
  onCreateProject: () => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  uploadState,
  expandedElements,
  isCreatingProject,
  hasSelectedQueries,
  canCreateProject,
  onDrop,
  onFileSelect,
  onClearImage,
  onToggleElement,
  onUpdateSelectedQuery,
  onSelectAllElements,
  onCreateProject
}) => {
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [apiLimits, setApiLimits] = useState<{amazon: boolean, etsy: boolean}>({
    amazon: true,
    etsy: true
  });
  const [editingQuery, setEditingQuery] = useState<{elementName: string, marketplace: 'amazon' | 'etsy', queryIndex: number} | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [lastUploadState, setLastUploadState] = useState<UploadState | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const canEditQueries = subscription.tier === 'pro' || subscription.tier === 'studio';

  // Enhanced drag handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!canCreateProject) {
      navigate('/upgrade');
      return;
    }
    
    onDrop(e);
  };

  // Check API limits on component mount
  useEffect(() => {
    const checkApiLimits = async () => {
      try {
        const amazonLimit = await ApiUsageService.checkApiUsageLimit('amazon');
        const etsyLimit = await ApiUsageService.checkApiUsageLimit('etsy');
        
        setApiLimits({
          amazon: amazonLimit,
          etsy: etsyLimit
        });
      } catch (error) {
        console.error('Error checking API limits:', error);
      }
    };
    
    checkApiLimits();
  }, []);

  // Save the last successful upload state when status changes to 'complete'
  useEffect(() => {
    if (uploadState.status === 'complete' && uploadState.file) {
      const stateToStore = {
        ...uploadState,
        file: null,
        preview: uploadState.preview
      };
      
      localStorage.setItem('lastUploadState', JSON.stringify(stateToStore));
      setLastUploadState({...uploadState});
    }
  }, [uploadState.status, uploadState.file]);

  // Load the last upload state from localStorage on component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('lastUploadState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setLastUploadState(parsedState);
      }
    } catch (error) {
      console.error('Error loading last upload state:', error);
    }
  }, []);

  const renderUploadState = () => {
    const stateConfig = {
      uploading: {
        icon: <Loader2 className="animate-spin text-violet-600" size={20} />,
        text: 'Uploading image...',
        color: 'text-violet-700',
        bg: 'bg-violet-50/80',
        border: 'border-violet-200/60'
      },
      analyzing: {
        icon: <Sparkles className="animate-pulse text-amber-600" size={20} />,
        text: 'AI analyzing design...',
        color: 'text-amber-700',
        bg: 'bg-amber-50/80',
        border: 'border-amber-200/60'
      },
      complete: {
        icon: <CheckCircle2 className="text-emerald-600" size={20} />,
        text: 'Analysis complete!',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50/80',
        border: 'border-emerald-200/60'
      },
      error: {
        icon: <XCircle className="text-red-600" size={20} />,
        text: uploadState.error || 'Upload failed. Please try again.',
        color: 'text-red-700',
        bg: 'bg-red-50/80',
        border: 'border-red-200/60'
      }
    };

    const config = stateConfig[uploadState.status];
    if (!config) return null;

    return (
      <motion.div 
        className={`inline-flex items-center space-x-3 px-4 py-3 rounded-2xl border ${config.bg} ${config.border} ${config.color} font-medium`}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {config.icon}
        <span>{config.text}</span>
      </motion.div>
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canCreateProject) {
      navigate('/upgrade');
      e.target.value = '';
      return;
    }
    onFileSelect(e);
  };

  const handleUpgradeClick = () => {
    navigate('/upgrade');
  };

  const renderElementStatus = (element: DetectedElement) => {
    if (!element.selectedAmazonQuery && !element.selectedEtsyQuery) return null;
    
    const statusConfig = {
      searching: { icon: <Loader2 size={14} className="text-violet-500 animate-spin" />, bg: 'bg-violet-100' },
      complete: { icon: <CheckCircle2 size={14} className="text-emerald-500" />, bg: 'bg-emerald-100' },
      error: { icon: <XCircle size={14} className="text-red-500" />, bg: 'bg-red-100' }
    };

    const config = statusConfig[element.status];
    if (!config) return null;

    return (
      <motion.div 
        className={`ml-2 flex items-center justify-center w-7 h-7 rounded-full ${config.bg}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {config.icon}
      </motion.div>
    );
  };

  const handleToggleElement = (elementName: string) => {
    if (expandedElements.includes(elementName)) {
      onToggleElement(elementName);
      return;
    }
    
    expandedElements.forEach(expandedElement => {
      if (expandedElement !== elementName) {
        onToggleElement(expandedElement);
      }
    });
    
    if (!expandedElements.includes(elementName)) {
      onToggleElement(elementName);
    }
  };

  const handleQuerySelection = (elementName: string, query: string, marketplace: 'amazon' | 'etsy') => {
    onUpdateSelectedQuery(elementName, query, marketplace);
    
    const element = uploadState.detectedElements.find(el => el.name === elementName);
    
    if (element) {
      const willHaveAmazonQuery = marketplace === 'amazon' ? !!query : !!element.selectedAmazonQuery;
      const willHaveEtsyQuery = marketplace === 'etsy' ? !!query : !!element.selectedEtsyQuery;
      
      if (willHaveAmazonQuery && willHaveEtsyQuery) {
        setTimeout(() => {
          if (expandedElements.includes(elementName)) {
            onToggleElement(elementName);
          }
        }, 300);
      }
    }
  };

  const handleEditQueryClick = (elementName: string, marketplace: 'amazon' | 'etsy', queryIndex: number, currentQuery: string) => {
    if (!canEditQueries) {
      setShowUpgradeModal(true);
      return;
    }
    
    setEditingQuery({ elementName, marketplace, queryIndex });
    setCustomQuery(currentQuery);
  };

  const handleSaveCustomQuery = () => {
    if (editingQuery && customQuery.trim()) {
      onUpdateSelectedQuery(editingQuery.elementName, customQuery.trim(), editingQuery.marketplace);
      setEditingQuery(null);
      setCustomQuery('');
    }
  };

  const handleCancelEdit = () => {
    setEditingQuery(null);
    setCustomQuery('');
  };

  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  const handleRefresh = () => {
    if (lastUploadState) {
      onClearImage();
      
      setTimeout(() => {
        if (lastUploadState.file) {
          onFileSelect({
            target: {
              files: [lastUploadState.file]
            }
          } as React.ChangeEvent<HTMLInputElement>);
        } 
        else if (lastUploadState.preview && lastUploadState.detectedElements.length > 0) {
          fetch(lastUploadState.preview)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "restored-image.jpg", { type: "image/jpeg" });
              onFileSelect({
                target: {
                  files: [file]
                }
              } as React.ChangeEvent<HTMLInputElement>);
            })
            .catch(err => {
              console.error("Error restoring image from preview:", err);
            });
        }
      }, 100);
    }
  };

  const getEtsyLimit = () => {
    if (subscription.tier === 'free') return 25;
    if (subscription.tier === 'pro') return 125;
    return 750;
  };

  return (
    <motion.div 
      className="relative bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-2xl border border-slate-200/40 rounded-3xl shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-700 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            className="font-bold text-2xl text-slate-900 flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-full blur-sm animate-pulse"></div>
            </div>
            New Project
            {uploadState.status === 'complete' && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 17 }}
                className="text-emerald-500"
              >
                <Sparkles size={20} />
              </motion.div>
            )}
          </motion.h2>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {uploadState.status !== 'idle' && (
              <motion.button
                onClick={onClearImage}
                className="group p-3 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-200/60"
                title="Clear image"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={18} className="group-hover:animate-pulse" />
              </motion.button>
            )}
            {lastUploadState && lastUploadState.preview && (uploadState.status === 'idle' || uploadState.status === 'error') && (
              <motion.button
                onClick={handleRefresh}
                className="group p-3 text-slate-400 hover:text-violet-500 hover:bg-violet-50/80 rounded-2xl transition-all duration-300 border border-transparent hover:border-violet-200/60"
                title="Reload last image"
                whileHover={{ scale: 1.05, y: -2, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={18} />
              </motion.button>
            )}
          </motion.div>
        </div>
        
        {/* Enhanced Upload Area */}
        <motion.div 
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center mb-8 transition-all duration-500 overflow-hidden ${
            uploadState.status === 'idle' 
              ? canCreateProject 
                ? isDragOver
                  ? 'border-violet-400 bg-gradient-to-br from-violet-50/80 to-blue-50/60 scale-[1.02]'
                  : 'border-slate-300/60 hover:border-violet-400/60 hover:bg-gradient-to-br hover:from-violet-50/40 hover:to-blue-50/30'
                : 'border-amber-300/60 bg-gradient-to-br from-amber-50/40 to-orange-50/30'
              : 'border-violet-400/60 bg-gradient-to-br from-violet-50/40 to-blue-50/30'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          whileHover={{ 
            scale: uploadState.status === 'idle' && canCreateProject ? 1.005 : 1,
            transition: { type: "spring", stiffness: 400, damping: 17 }
          }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500 animate-pulse"></div>
          </div>

          {uploadState.preview ? (
            <motion.div 
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative group">
                <img 
                  src={uploadState.preview} 
                  alt="Preview" 
                  className="w-full h-56 object-cover rounded-2xl shadow-2xl border border-white/60" 
                />
                {/* Enhanced overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="mt-8 flex justify-center">
                {renderUploadState()}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {canCreateProject && (
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-6"
                >
                  <Upload className="mx-auto text-slate-400" size={48} />
                </motion.div>
              )}
              
              {!canCreateProject ? (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl border border-amber-200/40">
                    <Crown className="mx-auto mb-3 text-amber-600" size={32} />
                    <p className="text-amber-800 mb-2 font-semibold text-lg">Project Limit Reached</p>
                    <p className="text-amber-700 mb-1 text-sm">You've used all {subscription.limits.projects} free projects</p>
                    <p className="text-amber-600 text-xs">Upgrade to Pro for unlimited projects</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-slate-600 font-medium text-lg">Drag and drop your design image here</p>
                  <div className="flex items-center gap-4 justify-center">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1 max-w-16"></div>
                    <span className="text-slate-400 text-sm font-medium">or</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1 max-w-16"></div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                {canCreateProject ? (
                  <label className="cursor-pointer group">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <motion.div 
                      className="relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-lg hover:shadow-xl group-hover:shadow-slate-900/25"
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Enhanced shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <ImageIcon size={20} className="relative z-10" />
                      <span className="relative z-10">Browse Files</span>
                    </motion.div>
                  </label>
                ) : (
                  <motion.button
                    onClick={handleUpgradeClick}
                    className="relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <Crown size={20} className="relative z-10" />
                    <span className="relative z-10">Upgrade to Continue</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Detected Elements Section */}
        {uploadState.status === 'complete' && uploadState.detectedElements && (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            {/* Enhanced Header */}
            <div className="flex justify-between items-center">
              <motion.h3 
                className="font-bold text-xl text-slate-900 flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-sm animate-pulse"></div>
                </div>
                Detected Elements
                <span className="text-sm font-medium px-3 py-1 bg-emerald-100/80 text-emerald-700 rounded-full border border-emerald-200/60">
                  {uploadState.detectedElements.length}
                </span>
              </motion.h3>
              
              <motion.button
                onClick={onSelectAllElements}
                className="group flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-semibold px-4 py-2 rounded-xl hover:bg-violet-50/80 transition-all duration-200 border border-transparent hover:border-violet-200/60"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
                Select All
              </motion.button>
            </div>
            
            {/* Enhanced Platform Info */}
            <motion.div 
              className="p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-2xl border border-blue-200/40"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-800 font-semibold text-sm mb-1">Dual Marketplace Search</p>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    Select one search query from each marketplace (Amazon and Etsy) for each design element.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Elements List */}
            <div className="space-y-4">
              <AnimatePresence>
                {uploadState.detectedElements.map((element, index) => (
                  <motion.div
                    key={element.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                    className="group border border-slate-200/60 rounded-2xl overflow-hidden bg-gradient-to-r from-white/80 to-slate-50/60 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300 hover:border-slate-300/60"
                  >
                    <motion.div
                      className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50/50 transition-all duration-200"
                      onClick={() => handleToggleElement(element.name)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center border border-violet-200/40">
                          <span className="text-violet-700 font-bold text-sm">{element.name.charAt(0)}</span>
                        </div>
                        <div>
                          <span className="text-slate-800 font-semibold">{element.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {element.selectedAmazonQuery && (
                              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full border border-orange-200/60">
                                Amazon
                              </span>
                            )}
                            {element.selectedEtsyQuery && (
                              <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full border border-teal-200/60">
                                Etsy
                              </span>
                            )}
                          </div>
                        </div>
                        {renderElementStatus(element)}
                      </div>
                      <motion.div
                        animate={{ rotate: expandedElements.includes(element.name) ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="p-2 rounded-full group-hover:bg-slate-100/80 transition-colors duration-200"
                      >
                        <ChevronDown size={18} className="text-slate-400" />
                      </motion.div>
                    </motion.div>

                    <AnimatePresence>
                      {expandedElements.includes(element.name) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-slate-200/60 bg-gradient-to-br from-slate-50/60 to-white/80 p-6"
                        >
                          {/* Error message if search failed */}
                          {element.status === 'error' && element.errorMessage && (
                            <motion.div 
                              className="mb-6 p-4 bg-gradient-to-r from-red-50/80 to-rose-50/60 border border-red-200/60 rounded-xl"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <div className="flex items-start gap-3">
                                <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-red-800 font-semibold text-sm mb-1">Search Error</p>
                                  <p className="text-red-700 text-xs">{element.errorMessage}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          
                          <div className="space-y-6">
                            {/* Enhanced Amazon Queries */}
                            {apiLimits.amazon && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <h4 className="text-sm font-bold text-orange-800 mb-4 flex items-center gap-3">
                                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  </div>
                                  Amazon Options
                                  <span className="text-xs font-medium px-2 py-1 bg-orange-100/80 text-orange-700 rounded-full">
                                    {element.amazonQueries.length}
                                  </span>
                                </h4>
                                <div className="space-y-3">
                                  {element.amazonQueries.map((query, queryIndex) => (
                                    <motion.div 
                                      key={`amazon-${queryIndex}`} 
                                      className="group relative p-4 rounded-xl hover:bg-white/80 transition-all duration-200 border border-transparent hover:border-orange-200/60 hover:shadow-sm"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: queryIndex * 0.05 }}
                                      whileHover={{ x: 2 }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center flex-1 min-w-0">
                                          <motion.input
                                            type="checkbox"
                                            name={`amazon-query-${element.name}`}
                                            value={query}
                                            checked={element.selectedAmazonQuery === query}
                                            onChange={() => {
                                              handleQuerySelection(
                                                element.name, 
                                                element.selectedAmazonQuery === query ? '' : query,
                                                'amazon'
                                              );
                                            }}
                                            className="form-checkbox h-5 w-5 text-orange-600 border-2 border-orange-300 focus:ring-orange-500 focus:ring-2 rounded-md transition-all duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                          />
                                          <span className="ml-4 text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors duration-200">{query}</span>
                                        </div>
                                        <motion.button
                                          onClick={() => handleEditQueryClick(element.name, 'amazon', queryIndex, query)}
                                          className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50/80 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 border border-transparent hover:border-orange-200/60"
                                          whileHover={{ scale: 1.1, rotate: 5 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Edit2 size={14} />
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {/* Enhanced Etsy Queries */}
                            {apiLimits.etsy && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <h4 className="text-sm font-bold text-teal-800 mb-4 flex items-center gap-3">
                                  <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                  </div>
                                  Etsy Options
                                  <span className="text-xs font-medium px-2 py-1 bg-teal-100/80 text-teal-700 rounded-full">
                                    {element.etsyQueries.length}
                                  </span>
                                </h4>
                                <div className="space-y-3">
                                  {element.etsyQueries.map((query, queryIndex) => (
                                    <motion.div 
                                      key={`etsy-${queryIndex}`} 
                                      className="group relative p-4 rounded-xl hover:bg-white/80 transition-all duration-200 border border-transparent hover:border-teal-200/60 hover:shadow-sm"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: queryIndex * 0.05 }}
                                      whileHover={{ x: 2 }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center flex-1 min-w-0">
                                          <motion.input
                                            type="checkbox"
                                            name={`etsy-query-${element.name}`}
                                            value={query}
                                            checked={element.selectedEtsyQuery === query}
                                            onChange={() => {
                                              handleQuerySelection(
                                                element.name, 
                                                element.selectedEtsyQuery === query ? '' : query,
                                                'etsy'
                                              );
                                            }}
                                            className="form-checkbox h-5 w-5 text-teal-600 border-2 border-teal-300 focus:ring-teal-500 focus:ring-2 rounded-md transition-all duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                          />
                                          <span className="ml-4 text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors duration-200">{query}</span>
                                        </div>
                                        <motion.button
                                          onClick={() => handleEditQueryClick(element.name, 'etsy', queryIndex, query)}
                                          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50/80 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 border border-transparent hover:border-teal-200/60"
                                          whileHover={{ scale: 1.1, rotate: 5 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Edit2 size={14} />
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {/* Enhanced API Limit Warning Messages */}
                            {!apiLimits.amazon && (
                              <motion.div 
                                className="p-5 bg-gradient-to-r from-amber-50/80 to-orange-50/60 border border-amber-200/60 rounded-xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-amber-600 text-xs font-bold">!</span>
                                  </div>
                                  <div>
                                    <p className="text-amber-800 font-semibold text-sm mb-1">Amazon API Limit Reached</p>
                                    <p className="text-amber-700 text-xs leading-relaxed">
                                      You've reached your Amazon API usage limit for this month. Upgrade your plan for more credits.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {!apiLimits.etsy && (
                              <motion.div 
                                className="p-5 bg-gradient-to-r from-amber-50/80 to-orange-50/60 border border-amber-200/60 rounded-xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-amber-600 text-xs font-bold">!</span>
                                  </div>
                                  <div>
                                    <p className="text-amber-800 font-semibold text-sm mb-1">Etsy API Limit Reached</p>
                                    <p className="text-amber-700 text-xs leading-relaxed">
                                      You've reached your Etsy API usage limit ({getEtsyLimit()}) for this month. Upgrade your plan for more credits.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {!apiLimits.amazon && !apiLimits.etsy && (
                              <motion.div className="mt-4">
                                <motion.button
                                  onClick={handleUpgradeClick}
                                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    <Crown size={16} />
                                    <span>Upgrade for More API Credits</span>
                                  </div>
                                </motion.button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Enhanced Project Limit Warning */}
            {!canCreateProject && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-r from-amber-50/80 to-orange-50/60 border border-amber-200/60 rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Crown size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-amber-800 text-base font-bold mb-2">Project Limit Reached</p>
                    <p className="text-amber-700 text-sm leading-relaxed mb-3">
                      You've reached the limit of {subscription.limits.projects} projects for your free plan. 
                      Upgrade to Pro for unlimited projects and premium features.
                    </p>
                    <motion.button
                      onClick={handleUpgradeClick}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900 hover:bg-amber-100/80 px-3 py-1.5 rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Star size={14} />
                      View Upgrade Options
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ 
                scale: canCreateProject && hasSelectedQueries && !isCreatingProject ? 1.02 : 1,
                y: canCreateProject && hasSelectedQueries && !isCreatingProject ? -2 : 0
              }}
              whileTap={{ scale: canCreateProject && hasSelectedQueries && !isCreatingProject ? 0.98 : 1 }}
            >
              <Button
                variant="secondary"
                size="lg"
                className={`relative w-full font-bold py-5 rounded-2xl transition-all duration-300 overflow-hidden ${
                  canCreateProject && hasSelectedQueries && !isCreatingProject
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-xl hover:shadow-2xl border border-slate-700/20'
                    : !canCreateProject
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300/60'
                }`}
                disabled={!hasSelectedQueries || isCreatingProject || (!canCreateProject && hasSelectedQueries)}
                onClick={!canCreateProject ? handleUpgradeClick : onCreateProject}
              >
                {/* Shimmer effect for active states */}
                {(canCreateProject && hasSelectedQueries && !isCreatingProject) || !canCreateProject ? (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ) : null}

                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isCreatingProject ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-lg">Creating Project...</span>
                    </>
                  ) : !canCreateProject ? (
                    <>
                      <Crown size={20} />
                      <span className="text-lg">Upgrade to Continue</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span className="text-lg">Search Recommendations</span>
                    </>
                  )}
                </div>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Edit Query Modal */}
      <AnimatePresence>
        {editingQuery && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-lg w-full border border-slate-200/60"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Edit2 className="text-violet-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Edit {editingQuery.marketplace === 'amazon' ? 'Amazon' : 'Etsy'} Query
                </h3>
                <p className="text-slate-600 text-sm">Customize your search query for better results</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-800 mb-3">
                  Custom Search Query
                </label>
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200 bg-white/80"
                  placeholder="Enter your custom search query"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveCustomQuery}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!customQuery.trim()}
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full border border-slate-200/60"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <Crown className="text-violet-600" size={24} />
                  <div className="absolute -inset-1 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-sm animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Pro Feature
                </h3>
                <p className="text-slate-600">
                  Custom search query editing is available on Pro and Studio plans.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-violet-50/80 to-purple-50/60 rounded-2xl p-6 mb-6 border border-violet-200/40">
                <h4 className="font-bold text-violet-800 mb-3 flex items-center gap-2">
                  <Star size={16} />
                  Pro Plan Benefits
                </h4>
                <ul className="space-y-3 text-sm text-violet-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-violet-600" />
                    <span>Custom search query editing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-violet-600" />
                    <span>25 active projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-violet-600" />
                    <span>200 Amazon searches/month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-violet-600" />
                    <span>125 Etsy searches/month</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={handleCloseUpgradeModal}
                  className="px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  onClick={handleUpgradeClick}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upgrade Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageUploadSection;