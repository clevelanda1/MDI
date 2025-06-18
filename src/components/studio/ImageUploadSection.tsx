import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon, Trash2, ChevronDown, Sparkles, CheckCircle2, XCircle, Loader2, Crown, Edit2, RefreshCw } from 'lucide-react';
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
  canCreateProject: boolean; // New prop for project limit
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

  // Check if user can edit queries (Pro or Studio plan only)
  const canEditQueries = subscription.tier === 'pro' || subscription.tier === 'studio';

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
      // Store the last successful upload state in localStorage
      const stateToStore = {
        ...uploadState,
        file: null, // Don't store the file object in localStorage
        preview: uploadState.preview // Keep the preview URL
      };
      
      // Store in localStorage
      localStorage.setItem('lastUploadState', JSON.stringify(stateToStore));
      
      // Also keep in memory for immediate use
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
    switch (uploadState.status) {
      case 'uploading':
        return (
          <motion.div 
            className="flex items-center space-x-3 text-slate-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Loader2 className="animate-spin text-violet-600" size={20} />
            <span className="font-medium">Uploading image...</span>
          </motion.div>
        );
      case 'analyzing':
        return (
          <motion.div 
            className="flex items-center space-x-3 text-slate-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Loader2 className="animate-spin text-violet-600" size={20} />
            <span className="font-medium">Analyzing design...</span>
          </motion.div>
        );
      case 'complete':
        return (
          <motion.div 
            className="flex items-center space-x-3 text-emerald-600"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle2 size={20} />
            <span className="font-medium">Analysis complete!</span>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div 
            className="flex items-center space-x-3 text-red-600"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <XCircle size={20} />
            <span className="font-medium">{uploadState.error || 'Upload failed. Please try again.'}</span>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Handle file selection with project limit check
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check project limit before processing image
    if (!canCreateProject) {
      // Navigate to upgrade page instead of triggering modal
      navigate('/upgrade');
      // Clear the file input
      e.target.value = '';
      return;
    }
    
    // If limit not reached, proceed with normal file processing
    onFileSelect(e);
  };

  // Handle drag and drop with project limit check
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Check project limit before processing image
    if (!canCreateProject) {
      // Navigate to upgrade page instead of triggering modal
      navigate('/upgrade');
      return;
    }
    
    // If limit not reached, proceed with normal drop processing
    onDrop(e);
  };

  // Handle upgrade button click
  const handleUpgradeClick = () => {
    navigate('/upgrade');
  };

  // Handle refresh button click to restore last uploaded image
  const handleRefresh = () => {
    if (lastUploadState) {
      // Clear current state first
      onClearImage();
      
      // Small delay to ensure state is cleared before restoring
      setTimeout(() => {
        // If we have a file in memory, use it directly
        if (lastUploadState.file) {
          onFileSelect({
            target: {
              files: [lastUploadState.file]
            }
          } as React.ChangeEvent<HTMLInputElement>);
        } 
        // Otherwise, try to use the stored state without the file
        else if (lastUploadState.preview && lastUploadState.detectedElements.length > 0) {
          // Create a dummy file from the preview URL
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

  // Render element status indicator
  const renderElementStatus = (element: DetectedElement) => {
    if (!element.selectedAmazonQuery && !element.selectedEtsyQuery) return null;
    
    switch (element.status) {
      case 'searching':
        return (
          <div className="ml-2 flex items-center">
            <Loader2 size={14} className="text-violet-500 animate-spin" />
          </div>
        );
      case 'complete':
        return (
          <div className="ml-2 flex items-center">
            <CheckCircle2 size={14} className="text-emerald-500" />
          </div>
        );
      case 'error':
        return (
          <div className="ml-2 flex items-center">
            <XCircle size={14} className="text-red-500" />
          </div>
        );
      default:
        return null;
    }
  };

  // Enhanced toggle element function that closes other dropdowns
  const handleToggleElement = (elementName: string) => {
    // If this element is already expanded, just close it
    if (expandedElements.includes(elementName)) {
      onToggleElement(elementName);
      return;
    }
    
    // Close all other dropdowns and open this one
    const newExpandedElements = [elementName];
    
    // For each currently expanded element that we're about to close,
    // check if it has both Amazon and Etsy queries selected
    expandedElements.forEach(expandedElement => {
      if (expandedElement !== elementName) {
        onToggleElement(expandedElement);
      }
    });
    
    // Open the clicked element
    if (!expandedElements.includes(elementName)) {
      onToggleElement(elementName);
    }
  };

  // Handle query selection with auto-close logic
  const handleQuerySelection = (elementName: string, query: string, marketplace: 'amazon' | 'etsy') => {
    // Update the selected query
    onUpdateSelectedQuery(elementName, query, marketplace);
    
    // Get the current element
    const element = uploadState.detectedElements.find(el => el.name === elementName);
    
    // If element exists and after this selection it will have both Amazon and Etsy queries selected,
    // close the dropdown
    if (element) {
      const willHaveAmazonQuery = marketplace === 'amazon' ? !!query : !!element.selectedAmazonQuery;
      const willHaveEtsyQuery = marketplace === 'etsy' ? !!query : !!element.selectedEtsyQuery;
      
      if (willHaveAmazonQuery && willHaveEtsyQuery) {
        // Close the dropdown after a short delay to allow the UI to update
        setTimeout(() => {
          if (expandedElements.includes(elementName)) {
            onToggleElement(elementName);
          }
        }, 300);
      }
    }
  };

  // Handle edit query button click
  const handleEditQueryClick = (elementName: string, marketplace: 'amazon' | 'etsy', queryIndex: number, currentQuery: string) => {
    if (!canEditQueries) {
      setShowUpgradeModal(true);
      return;
    }
    
    setEditingQuery({ elementName, marketplace, queryIndex });
    setCustomQuery(currentQuery);
  };

  // Handle save custom query
  const handleSaveCustomQuery = () => {
    if (editingQuery && customQuery.trim()) {
      onUpdateSelectedQuery(editingQuery.elementName, customQuery.trim(), editingQuery.marketplace);
      setEditingQuery(null);
      setCustomQuery('');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingQuery(null);
    setCustomQuery('');
  };

  // Close upgrade modal
  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  // Get Etsy limit based on subscription tier
  const getEtsyLimit = () => {
    if (subscription.tier === 'free') return 25;
    if (subscription.tier === 'pro') return 125;
    return 750; // studio tier
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-semibold text-2xl text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
          New Project
        </h2>
        <div className="flex items-center gap-2">
          {uploadState.status !== 'idle' && (
            <motion.button
              onClick={onClearImage}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded-full transition-all duration-300"
              title="Clear image"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 size={18} />
            </motion.button>
          )}
          {lastUploadState && (uploadState.status === 'idle' || uploadState.status === 'error') && (
            <motion.button
              onClick={handleRefresh}
              className="p-2.5 text-slate-400 hover:text-violet-500 hover:bg-violet-50/80 rounded-full transition-all duration-300"
              title="Reload last image"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={18} />
            </motion.button>
          )}
        </div>
      </div>
      
      <motion.div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center mb-8 transition-all duration-300 relative overflow-hidden ${
          uploadState.status === 'idle' 
            ? canCreateProject 
              ? 'border-slate-300/60 hover:border-violet-400 hover:bg-violet-50/30' 
              : 'border-amber-300/60 bg-amber-50/20'
            : 'border-violet-400/60 bg-violet-50/20'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        whileHover={{ scale: uploadState.status === 'idle' && canCreateProject ? 1.01 : 1 }}
      >
        {uploadState.preview ? (
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <img 
              src={uploadState.preview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-xl shadow-lg" 
            />
            <div className="mt-6">
              {renderUploadState()}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Only show upload icon when user can create projects */}
            {canCreateProject && (
              <Upload className="mx-auto mb-6 text-slate-400" size={36} />
            )}
            
            {!canCreateProject ? (
              <>
                <p className="text-amber-700 mb-4 font-medium">Project limit reached ({limits.projects}/{limits.projects})</p>
                <p className="text-amber-600 mb-6 text-sm">Upgrade to Pro for unlimited projects or delete an existing project</p>
              </>
            ) : (
              <p className="text-slate-600 mb-6 font-medium">Drag and drop your image here or</p>
            )}
            
            <div className="flex justify-center">
              {canCreateProject ? (
                // Show file input label only when user can create projects
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <motion.div 
                    className="relative flex items-center space-x-3 px-6 py-3.5 rounded-full font-medium transition-all duration-300 bg-slate-900 text-white hover:bg-slate-800"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      y: [0, -8, 0],
                      rotateX: [0, 10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Shimmer effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <ImageIcon size={18} className="relative z-10" />
                    <span className="relative z-10">Upload Image</span>
                  </motion.div>
                </label>
              ) : (
                // Show upgrade button when user cannot create projects
                <motion.button
                  onClick={handleUpgradeClick}
                  className="relative flex items-center space-x-3 px-6 py-3.5 rounded-full font-medium transition-all duration-300 bg-amber-600 text-white hover:bg-amber-700"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: [0, -8, 0],
                    rotateX: [0, 10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Shimmer effect overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Crown size={18} className="relative z-10" />
                  <span className="relative z-10">Upgrade to Upload</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {uploadState.status === 'complete' && uploadState.detectedElements && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Detected Elements
              </h3>
              <motion.button
                onClick={onSelectAllElements}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium px-3 py-1.5 rounded-full hover:bg-violet-50/80 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Select All
              </motion.button>
            </div>
            
            {/* Platform Info */}
            <div className="mb-4 p-3 bg-blue-50/80 rounded-xl">
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Dual Marketplace Search:</strong> You can select one search query from each marketplace (Amazon and Etsy) for each element.
              </p>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {uploadState.detectedElements.map((element, index) => (
                  <motion.div
                    key={element.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                    className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm hover:shadow-md hover:shadow-slate-900/5 transition-all duration-300"
                  >
                    <motion.div
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/50"
                      onClick={() => handleToggleElement(element.name)}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <span className="text-slate-700 font-medium">{element.name}</span>
                        {renderElementStatus(element)}
                      </div>
                      <motion.div
                        animate={{ rotate: expandedElements.includes(element.name) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
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
                          className="border-t border-slate-200/60 bg-slate-50/30 p-5"
                        >
                          {/* Error message if search failed */}
                          {element.status === 'error' && element.errorMessage && (
                            <div className="mb-4 p-3 bg-red-50/80 border border-red-200 rounded-xl">
                              <p className="text-xs text-red-700 font-medium">{element.errorMessage}</p>
                            </div>
                          )}
                          
                          <div className="space-y-4">
                            {/* Amazon Queries - Only show if user has API credits */}
                            {apiLimits.amazon && (
                              <div>
                                <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                  Amazon Options
                                </h4>
                                <div className="space-y-2">
                                  {element.amazonQueries.map((query, queryIndex) => (
                                    <motion.div 
                                      key={`amazon-${queryIndex}`} 
                                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/60 transition-colors duration-200 group"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: queryIndex * 0.05 }}
                                    >
                                      <div className="flex items-center flex-1 min-w-0">
                                        <input
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
                                          className="form-checkbox h-4 w-4 text-orange-600 border-slate-300 focus:ring-orange-500"
                                        />
                                        <span className="ml-3 text-sm text-slate-600 font-medium">{query}</span>
                                      </div>
                                      <motion.button
                                        onClick={() => handleEditQueryClick(element.name, 'amazon', queryIndex, query)}
                                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        <Edit2 size={14} />
                                      </motion.button>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Etsy Queries - Only show if user has API credits */}
                            {apiLimits.etsy && (
                              <div>
                                <h4 className="text-sm font-medium text-teal-700 mb-2 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                                  Etsy Options
                                </h4>
                                <div className="space-y-2">
                                  {element.etsyQueries.map((query, queryIndex) => (
                                    <motion.div 
                                      key={`etsy-${queryIndex}`} 
                                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/60 transition-colors duration-200 group"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: queryIndex * 0.05 }}
                                    >
                                      <div className="flex items-center flex-1 min-w-0">
                                        <input
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
                                          className="form-checkbox h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                                        />
                                        <span className="ml-3 text-sm text-slate-600 font-medium">{query}</span>
                                      </div>
                                      <motion.button
                                        onClick={() => handleEditQueryClick(element.name, 'etsy', queryIndex, query)}
                                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        <Edit2 size={14} />
                                      </motion.button>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* API Limit Warning Messages */}
                            {!apiLimits.amazon && (
                              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                                <p className="text-xs text-amber-700 font-medium">
                                  You've reached your Amazon API usage limit for this month. Upgrade your plan for more credits.
                                </p>
                              </div>
                            )}

                            {!apiLimits.etsy && (
                              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                                <p className="text-xs text-amber-700 font-medium">
                                  You've reached your Etsy API usage limit ({getEtsyLimit()}) for this month. Upgrade your plan for more credits.
                                </p>
                              </div>
                            )}

                            {!apiLimits.amazon && !apiLimits.etsy && (
                              <div className="mt-2">
                                <motion.button
                                  onClick={handleUpgradeClick}
                                  className="w-full px-4 py-2 bg-amber-600 text-white text-sm rounded-lg font-medium hover:bg-amber-700 transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Upgrade for More API Credits
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Project Limit Warning */}
          {!canCreateProject && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-600 text-xs">!</span>
                </div>
                <div>
                  <p className="text-amber-800 text-sm font-medium mb-1">Project Limit Reached</p>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    You've reached the limit of {limits.projects} projects for your free plan. 
                    Upgrade to Pro for unlimited projects.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: canCreateProject && hasSelectedQueries && !isCreatingProject ? 1.02 : 1 }}
            whileTap={{ scale: canCreateProject && hasSelectedQueries && !isCreatingProject ? 0.98 : 1 }}
          >
            <Button
              variant="secondary"
              size="lg"
              className={`w-full font-medium py-4 rounded-2xl shadow-lg transition-all duration-300 ${
                canCreateProject && hasSelectedQueries && !isCreatingProject
                  ? 'bg-slate-900 text-white hover:shadow-xl hover:bg-slate-800'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
              disabled={!hasSelectedQueries || isCreatingProject || !canCreateProject}
              onClick={!canCreateProject ? handleUpgradeClick : onCreateProject}
            >
              {isCreatingProject ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Creating Project...
                </>
              ) : !canCreateProject ? (
                <>
                  Upgrade
                </>
              ) : (
                <>
                  Generate Product Recommendations
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Query Modal */}
      <AnimatePresence>
        {editingQuery && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Edit {editingQuery.marketplace === 'amazon' ? 'Amazon' : 'Etsy'} Search Query
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Custom Query
                </label>
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                  placeholder="Enter your custom search query"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveCustomQuery}
                  className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!customQuery.trim()}
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="text-violet-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Pro Feature
                </h3>
                <p className="text-slate-600">
                  Custom search query editing is available on Pro and Studio plans.
                </p>
              </div>
              
              <div className="bg-violet-50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-violet-800 mb-2">Pro Plan Benefits:</h4>
                <ul className="space-y-2 text-sm text-violet-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Custom search query editing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>25 active projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>200 Amazon searches/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>125 Etsy searches/month</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={handleCloseUpgradeModal}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  onClick={handleUpgradeClick}
                  className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700"
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
    </div>
  );
};

export default ImageUploadSection;