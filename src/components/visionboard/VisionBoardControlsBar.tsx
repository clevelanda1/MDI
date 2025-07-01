import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, RotateCcw, Save, Share2, FolderOpen, AlertCircle, Crown, Edit2, Sparkles, Zap } from 'lucide-react';
import SaveVisionBoardModal from './SaveVisionBoardModal';
import LoadVisionBoardModal from './LoadVisionBoardModal';
import ShareVisionBoardModal from './ShareVisionBoardModal';
import { SavedVisionBoard } from '../../services/visionBoardService';
import { VisionBoardItem } from '../../types/visionboard';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface VisionBoardControlsBarProps {
  itemCount: number;
  totalBudget: number;
  showSidebar: boolean;
  savedBoards: SavedVisionBoard[];
  isLoadingSavedBoards: boolean;
  isSaving: boolean;
  boardItems: VisionBoardItem[];
  currentBoardId?: string;
  currentBoardName: string;
  onToggleSidebar: () => void;
  onClearBoard: () => void;
  onSaveBoard: (boardName: string) => Promise<void>;
  onLoadBoard: (boardId: string) => Promise<void>;
  onDeleteBoard: (boardId: string) => Promise<void>;
  onLoadSavedBoards: () => Promise<void>;
  onUpdateBoardName?: (boardId: string, newName: string) => Promise<void>;
}

const VisionBoardControlsBar: React.FC<VisionBoardControlsBarProps> = ({
  itemCount,
  totalBudget,
  showSidebar,
  savedBoards,
  isLoadingSavedBoards,
  isSaving,
  boardItems,
  currentBoardId,
  currentBoardName,
  onToggleSidebar,
  onClearBoard,
  onSaveBoard,
  onLoadBoard,
  onDeleteBoard,
  onLoadSavedBoards,
  onUpdateBoardName
}) => {
  const { subscription, limits } = useSubscription();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUpgradeInfo, setShowUpgradeInfo] = useState(false);
  const [saveError, setShowSaveError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(currentBoardName);

  const canSaveVisionBoards = true;
  const canShareVisionBoards = subscription.tier !== 'free';
  const hasReachedSavedBoardsLimit = 
    (subscription.tier === 'free' && savedBoards.length >= limits.visionBoards && !currentBoardId) ||
    (subscription.tier === 'pro' && savedBoards.length >= limits.visionBoards && !currentBoardId);

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'studio':
        return {
          icon: Crown,
          bgColor: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
          borderColor: 'border-blue-500/20',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-500'
        };
      case 'pro':
        return {
          icon: Zap,
          bgColor: 'bg-gradient-to-r from-violet-500/10 to-purple-500/10',
          borderColor: 'border-violet-500/20',
          textColor: 'text-violet-700',
          iconColor: 'text-violet-500'
        };
      default:
        return {
          icon: Sparkles,
          bgColor: 'bg-gradient-to-r from-slate-500/10 to-gray-500/10',
          borderColor: 'border-slate-500/20',
          textColor: 'text-slate-700',
          iconColor: 'text-slate-500'
        };
    }
  };

  const tierConfig = getTierConfig(subscription.tier);

  const handleSaveBoard = async (boardName: string) => {
    try {
      if (hasReachedSavedBoardsLimit && !currentBoardId) {
        setShowSaveError(`You've reached the limit of ${limits.visionBoards} saved boards for your ${subscription.tier} plan.`);
        return;
      }
      
      setShowSaveError(null);
      await onSaveBoard(boardName);
      setShowSaveModal(false);
    } catch (error: any) {
      setShowSaveError(error.message || 'Failed to save vision board');
    }
  };

  const handleSaveClick = () => {
    if (itemCount === 0) {
      setShowUpgradeInfo(true);
      setTimeout(() => setShowUpgradeInfo(false), 3000);
      return;
    }
    
    if (hasReachedSavedBoardsLimit && !currentBoardId) {
      setShowUpgradeInfo(true);
      setTimeout(() => setShowUpgradeInfo(false), 3000);
      return;
    }
    
    setShowSaveModal(true);
  };

  const handleLoadClick = () => {
    if (savedBoards.length === 0 && !isLoadingSavedBoards) {
      setShowUpgradeInfo(true);
      setTimeout(() => setShowUpgradeInfo(false), 3000);
      return;
    }
    
    setShowLoadModal(true);
  };

  const handleShareClick = () => {
    if (!canShareVisionBoards) {
      setShowUpgradeInfo(true);
      setTimeout(() => setShowUpgradeInfo(false), 3000);
      return;
    }
    
    if (!currentBoardId) {
      setShowUpgradeInfo(true);
      setTimeout(() => setShowUpgradeInfo(false), 3000);
      return;
    }
    
    setShowShareModal(true);
  };

  const handleEditNameClick = () => {
    if (!currentBoardId) return;
    setEditedName(currentBoardName);
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (!currentBoardId || !onUpdateBoardName || !editedName.trim()) {
      setIsEditingName(false);
      return;
    }
    
    try {
      await onUpdateBoardName(currentBoardId, editedName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating board name:', error);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setEditedName(currentBoardName);
    }
  };

  const hasNoBoardsToLoad = !isLoadingSavedBoards && savedBoards.length === 0;
  const isBoardSaved = !!currentBoardId;

  return (
    <div>
      {/* Main Controls Bar */}
      <div className="bg-white/95 backdrop-blur-2xl border-b border-slate-200/30 relative z-10 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-white/30 to-slate-50/50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            
            {/* Left Section */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Item Count */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm text-slate-700 font-semibold">
                  {itemCount} items on board
                </span>
              </div>

              {/* Budget Display */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200/30 rounded-full backdrop-blur-sm shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-emerald-700 font-medium">Total Budget:</span>
                <span className="font-bold text-emerald-800">${totalBudget.toLocaleString()}</span>
              </div>
              
              {/* Board Name */}
              {currentBoardId && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-50/80 to-blue-50/80 border border-violet-200/30 rounded-full backdrop-blur-sm shadow-sm">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onBlur={handleNameSave}
                      onKeyDown={handleNameKeyDown}
                      className="bg-transparent border-b border-violet-300 focus:outline-none focus:border-violet-500 text-sm text-violet-700 font-semibold px-1 py-0.5 w-40"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="text-sm text-violet-700 font-semibold">{currentBoardName}</span>
                      <button
                        onClick={handleEditNameClick}
                        className="p-1 text-violet-400 hover:text-violet-600 hover:bg-violet-100/60 rounded-full transition-all duration-200"
                      >
                        <Edit2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              )}
              
              {/* Tier Badge */}
              <div className={`flex items-center gap-2 px-4 py-2.5 ${tierConfig.bgColor} ${tierConfig.borderColor} border rounded-full backdrop-blur-sm shadow-md`}>
                {/*<tierConfig.icon size={16} className={tierConfig.iconColor} />*/}
                <span className={`text-xs font-bold ${tierConfig.textColor} uppercase tracking-wide`}>
                  {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan
                </span>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Toggle Sidebar */}
              <button
                onClick={onToggleSidebar}
                className="p-2.5 text-slate-500 hover:text-slate-700 bg-white/60 hover:bg-white/80 border border-slate-200/40 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                title="Toggle product sidebar"
              >
                {showSidebar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              
              {/* Clear Board */}
              <button
                onClick={onClearBoard}
                className="p-2.5 text-slate-500 hover:text-red-500 bg-white/60 hover:bg-red-50/80 border border-slate-200/40 hover:border-red-200/40 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                title="Clear board"
              >
                <RotateCcw size={18} />
              </button>
              
              {/* Load Button */}
              <button 
                onClick={handleLoadClick}
                disabled={hasNoBoardsToLoad}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white/80 hover:bg-white border border-slate-200/40 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md font-medium ${
                  hasNoBoardsToLoad 
                    ? 'opacity-50 cursor-not-allowed text-slate-400' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title={hasNoBoardsToLoad ? "No saved boards to load" : "Load saved board"}
              >
                <FolderOpen size={16} />
                <span>Load</span>
              </button>
              
              {/* Save Button */}
              <button 
                onClick={handleSaveClick}
                disabled={itemCount === 0 || isSaving || (hasReachedSavedBoardsLimit && !currentBoardId)}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white/80 hover:bg-white border border-slate-200/40 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md font-medium ${
                  itemCount === 0 || isSaving || (hasReachedSavedBoardsLimit && !currentBoardId)
                    ? 'opacity-50 cursor-not-allowed text-slate-400' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title={itemCount === 0 
                  ? "Add items to save" 
                  : hasReachedSavedBoardsLimit && !currentBoardId
                  ? `You've reached the limit of ${limits.visionBoards} saved boards`
                  : "Save board"}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
              
              {/* Share Button */}
              <button 
                onClick={handleShareClick}
                disabled={itemCount === 0 || !isBoardSaved || !canShareVisionBoards}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                  itemCount === 0 || !isBoardSaved || !canShareVisionBoards
                    ? 'opacity-50 cursor-not-allowed bg-slate-400 text-white' 
                    : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700'
                }`}
                title={!canShareVisionBoards 
                  ? "Upgrade to Pro or Studio to share boards" 
                  : !isBoardSaved 
                  ? "Save board first to share" 
                  : itemCount === 0
                  ? "Add items to share"
                  : "Share board"}
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          {/* Upgrade Info Message */}
          <AnimatePresence>
            {showUpgradeInfo && (
              <motion.div 
                className="absolute left-1/2 transform -translate-x-1/2 top-full mt-4 bg-white/95 backdrop-blur-xl border border-amber-200/40 rounded-2xl p-4 shadow-2xl z-50 flex items-start gap-4 max-w-md"
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
              >
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={18} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-amber-800 text-sm font-semibold mb-1">
                    {itemCount === 0 
                      ? "Add Items First" 
                      : hasReachedSavedBoardsLimit && !currentBoardId
                      ? "Board Limit Reached"
                      : !isBoardSaved && canShareVisionBoards
                      ? "Save Required"
                      : "Upgrade Required"}
                  </h4>
                  <p className="text-amber-700 text-xs leading-relaxed mb-2">
                    {itemCount === 0 
                      ? "Add some items to your vision board before saving." 
                      : hasReachedSavedBoardsLimit && !currentBoardId
                      ? `You've reached the limit of ${limits.visionBoards} saved boards for your ${subscription.tier} plan. Upgrade or delete some boards.`
                      : !isBoardSaved && canShareVisionBoards
                      ? "You need to save your board before sharing it."
                      : "Upgrade to Pro or Studio to access this feature."}
                  </p>
                  <a 
                    href="/upgrade" 
                    className="inline-flex items-center gap-1 text-xs text-amber-800 font-semibold hover:text-amber-900 transition-colors"
                  >
                    <Crown size={12} />
                    View Upgrade Options
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      {showSaveModal && (
        <SaveVisionBoardModal
          isOpen={showSaveModal}
          onClose={() => {
            setShowSaveModal(false);
            setShowSaveError(null);
          }}
          onSave={handleSaveBoard}
          isLoading={isSaving}
          initialName={currentBoardName || ""}
          error={saveError}
          hasReachedLimit={hasReachedSavedBoardsLimit && !currentBoardId}
          maxBoards={limits?.visionBoards || 1}
        />
      )}

      {showLoadModal && (
        <LoadVisionBoardModal
          isOpen={showLoadModal}
          onClose={() => setShowLoadModal(false)}
          onLoad={onLoadBoard}
          onDelete={onDeleteBoard}
          savedBoards={savedBoards || []}
          isLoading={isLoadingSavedBoards}
          onLoadSavedBoards={onLoadSavedBoards}
        />
      )}

      {showShareModal && currentBoardId && (
        <ShareVisionBoardModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          boardName={currentBoardName || "My Vision Board"}
          boardItems={boardItems || []}
          totalBudget={totalBudget || 0}
          originalBoardId={currentBoardId}
          isSaved={isBoardSaved}
          canShare={canShareVisionBoards}
        />
      )}
    </div>
  );
};

export default VisionBoardControlsBar;