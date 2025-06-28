import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, XCircle, Loader2, Edit2, Trash2, FolderOpen, X, Sparkles, Zap, Calendar } from 'lucide-react';
import { Project, ProjectFilters } from '../../types/studio';
import Button from '../common/Button';
import AIProcessingAnimation from './AIProcessingAnimation';

interface ProjectsSectionProps {
  projects: Project[];
  filteredProjects: Project[];
  isLoadingProjects: boolean;
  filters: ProjectFilters;
  editingProjectId: string | null;
  editInputRef: React.RefObject<HTMLInputElement>;
  likedProductCounts: Record<string, number>;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  onStartEditing: (projectId: string) => void;
  onProjectNameChange: (projectId: string, newName: string) => void;
  onProjectNameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, projectId: string) => void;
  onDeleteProject: (projectId: string, projectName: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps & { projectsSectionRef: React.RefObject<HTMLDivElement> }> = ({
  projects,
  filteredProjects,
  isLoadingProjects,
  filters,
  editingProjectId,
  editInputRef,
  likedProductCounts,
  onSearchChange,
  onClearSearch,
  onStartEditing,
  onProjectNameChange,
  onProjectNameKeyDown,
  onDeleteProject,
  projectsSectionRef
}) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  
  // Initialize AdSense when component mounts and when projects change
  useEffect(() => {
    const initializeAdSense = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          console.log('AdSense initialized successfully');
        } else {
          console.log('AdSense not yet available, will retry...');
          setTimeout(initializeAdSense, 1000);
        }
      } catch (error) {
        console.log('AdSense initialization error:', error);
      }
    };

    const timer = setTimeout(initializeAdSense, 100);
    return () => clearTimeout(timer);
  }, [filteredProjects]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }
    }
  };

  return (
    <motion.div 
      className="lg:col-span-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      ref={projectsSectionRef}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6"
        variants={headerVariants}
      >
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-blue-500 rounded-full"></div>
          <h2 className="font-light text-3xl text-slate-900">
            Your <span className="font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Projects</span>
          </h2>
          {projects.length > 0 && (
            <motion.span 
              className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold border border-violet-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {projects.length}
            </motion.span>
          )}
        </div>
        
        {/* Enhanced Search */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search your projects..." 
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-12 py-4 border border-slate-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm w-72 group-hover:border-slate-400/70 shadow-sm focus:shadow-md"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
          {filters.searchQuery && (
            <motion.button
              onClick={onClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <XCircle size={16} />
            </motion.button>
          )}
        </div>
      </motion.div>
      
      {/* Enhanced Loading State */}
      {isLoadingProjects ? (
        <motion.div 
          className="flex flex-col items-center justify-center h-80 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 rounded-3xl"></div>
          
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <motion.div
                className="w-16 h-16 border-4 border-slate-200 border-t-violet-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <div className="text-center">
              <motion.h3 
                className="font-bold text-slate-900 mb-2 text-lg"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading your creative projects...
              </motion.h3>
              <p className="text-slate-600">Gathering your design collection</p>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className={`${
            filters.viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 gap-8' 
              : 'space-y-6'
          }`}
          variants={containerVariants}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg transition-all duration-500 group relative ${
                  filters.viewMode === 'list' ? 'flex' : ''
                } ${
                  project.status !== 'analyzing' ? 'hover:shadow-2xl hover:shadow-slate-900/10' : ''
                }`}
                variants={itemVariants}
                layout
                whileHover={project.status !== 'analyzing' ? { 
                  y: -8, 
                  scale: filters.viewMode === 'grid' ? 1.02 : 1.01,
                  transition: { duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }
                } : {}}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Enhanced Delete button for analyzing projects */}
                <AnimatePresence>
                  {project.status === 'analyzing' && hoveredProject === project.id && (
                    <motion.button
                      onClick={() => onDeleteProject(project.id, project.name)}
                      className="absolute top-4 right-4 z-20 w-10 h-10 bg-red-500/95 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border border-red-400"
                      initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      title="Cancel project creation"
                      transition={{ duration: 0.2 }}
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Enhanced Image Container */}
                <div className={`relative overflow-hidden ${
                  filters.viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-56'
                }`}>
                  {project.status === 'analyzing' ? (
                    <div className="relative w-full h-full">
                      <AIProcessingAnimation />
                      {/* Extended purple overlay for processing state */}
                      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/80 via-violet-600/60 to-violet-800/80"></div>
                      
                      {/* Processing content overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <motion.div 
                          className="flex flex-col items-center gap-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center gap-3">
                            <Loader2 className="animate-spin" size={24} />
                            <span className="font-semibold text-lg">AI Agent Working...</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 text-sm">
                            <Sparkles size={14} />
                            <span>Analyzing your design</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <motion.img 
                      src={project.image_url || '/api/placeholder/400/300'} 
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/400/300';
                      }}
                    />
                  )}
                  
                  {/* Enhanced Overlay - Only show for non-analyzing projects */}
                  {project.status !== 'analyzing' && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"
                      initial={false}
                    >
                      {project.status === 'complete' ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="flex items-center gap-4"
                        >
                          <motion.button
                            onClick={() => window.location.href = `/curation?project=${project.id}`}
                            className="flex items-center gap-2 px-6 py-3 bg-white/95 text-slate-900 hover:bg-white font-semibold rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-200"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Project
                          </motion.button>
                          <motion.button
                            onClick={() => onDeleteProject(project.id, project.name)}
                            className="p-3 bg-red-500/95 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-xl backdrop-blur-sm border border-red-400"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="flex flex-col items-center gap-2 text-red-400"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span className="font-semibold text-lg">Processing Error</span>
                          <span className="text-sm text-red-300">Please try again</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Status indicator badge */}
                  <div className="absolute top-4 left-4">
                    {project.status === 'analyzing' ? (
                      <motion.div 
                        className="px-3 py-2 rounded-2xl text-xs font-bold shadow-lg backdrop-blur-sm border bg-violet-500/90 text-white border-violet-400"
                        whileHover={{ scale: 1.05 }}
                      >
                        Processing
                      </motion.div>
                    ) : (
                      likedProductCounts[project.id] && likedProductCounts[project.id] > 0 ? (
                        <motion.div 
                          className="px-3 py-2 rounded-2xl text-xs font-bold shadow-lg backdrop-blur-sm border bg-emerald-500/90 text-white border-emerald-400"
                          whileHover={{ scale: 1.05 }}
                        >
                          {likedProductCounts[project.id]}
                        </motion.div>
                      ) : project.status === 'error' ? (
                        <motion.div 
                          className="px-3 py-2 rounded-2xl text-xs font-bold shadow-lg backdrop-blur-sm border bg-red-500/90 text-white border-red-400"
                          whileHover={{ scale: 1.05 }}
                        >
                          Error
                        </motion.div>
                      ) : null
                    )}
                  </div>
                </div>
                
                {/* Enhanced Content Section */}
                <div className={`p-6 ${filters.viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    {editingProjectId === project.id ? (
                      <motion.input
                        ref={editInputRef}
                        type="text"
                        defaultValue={project.name}
                        className="font-bold text-xl text-slate-900 w-full border-b-2 border-slate-500 focus:outline-none bg-transparent pb-2 focus:border-slate-700 transition-colors"
                        onBlur={(e) => onProjectNameChange(project.id, e.target.value)}
                        onKeyDown={(e) => onProjectNameKeyDown(e, project.id)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : (
                      <>
                        <h3 className={`font-bold text-slate-900 leading-tight ${
                          filters.viewMode === 'list' ? 'text-lg' : 'text-xl'
                        }`}>
                          {project.name}
                        </h3>
                        {project.status !== 'analyzing' && (
                          <motion.button
                            onClick={() => onStartEditing(project.id)}
                            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all duration-200 group/edit"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit2 size={16} className="group-hover/edit:rotate-12 transition-transform duration-200" />
                          </motion.button>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className={`flex ${
                    filters.viewMode === 'list' ? 'flex-col space-y-3' : 'justify-between items-end'
                  }`}>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} />
                      <span className="font-medium">
                        {new Date(project.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <motion.span 
                      className={`px-4 py-2 rounded-full text-xs font-semibold border ${
                        project.status === 'analyzing' 
                          ? 'bg-violet-50 text-violet-700 border-violet-200' 
                          : project.status === 'complete'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {project.status === 'analyzing' ? 'AI Processing...' : 
                       project.status === 'complete' ? 'Ready to explore' : 'Needs attention'}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Enhanced Empty State */}
          {filteredProjects.length === 0 && !isLoadingProjects && (
            <motion.div 
              className="col-span-2 text-center py-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {filters.searchQuery ? (
                  <Search size={40} className="text-slate-400" />
                ) : (
                  <FolderOpen size={40} className="text-slate-400" />
                )}
              </motion.div>
              <h3 className="font-bold text-slate-900 mb-3 text-xl">
                {filters.searchQuery ? 'No projects found' : 'Create your first project'}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                {filters.searchQuery 
                  ? `No projects match "${filters.searchQuery}". Try adjusting your search terms.`
                  : 'Upload your first design image to get started with AI-powered product curation from Amazon and Etsy.'
                }
              </p>
              {!filters.searchQuery && (
                <motion.button
                  onClick={() => window.location.href = '/studio'}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-2xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Enhanced AdSense Advertisement */}
      <motion.div 
        className="mt-20 mb-8 w-full flex justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="w-full max-w-4xl bg-white/50 backdrop-blur-sm rounded-3xl p-1 border border-slate-200/50 shadow-lg">
          <ins 
            className="adsbygoogle"
            style={{ 
              display: 'block',
              minHeight: '120px',
              width: '100%',
              borderRadius: '1.5rem'
            }}
            data-ad-client="ca-pub-8497089190565366"
            data-ad-slot="5620786867"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectsSection;