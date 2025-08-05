import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  Filter,
  ChevronDown,
  AlertTriangle,
  Shield,
  Construction,
  Zap,
  Signpost,
  Download,
  ZoomIn
} from 'lucide-react';
import { DetectedObject } from '../types';

interface DetectionResultsProps {
  detectedObjects: DetectedObject[];
  onFeedback: (objectId: string, isAccurate: boolean, comments?: string) => void;
}

const OBJECT_ICONS = {
  pole: Zap,
  pothole: AlertTriangle,
  uneven_road: Construction,
  side_barrier: Shield,
  traffic_sign: Signpost
};

const OBJECT_COLORS = {
  pole: 'blue',
  pothole: 'red',
  uneven_road: 'orange',
  side_barrier: 'green',
  traffic_sign: 'purple'
};

export const DetectionResults: React.FC<DetectionResultsProps> = ({ 
  detectedObjects, 
  onFeedback 
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [feedbackComments, setFeedbackComments] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const objectTypes = ['all', ...Array.from(new Set(detectedObjects.map(obj => obj.type)))];
  
  const filteredObjects = selectedType === 'all' 
    ? detectedObjects 
    : detectedObjects.filter(obj => obj.type === selectedType);

  const handleFeedback = (objectId: string, isAccurate: boolean) => {
    const comments = feedbackComments[objectId] || '';
    onFeedback(objectId, isAccurate, comments);
    setShowFeedback(null);
    setFeedbackComments(prev => ({ ...prev, [objectId]: '' }));
  };

  const handleDownloadScreenshot = (screenshot: string, description: string) => {
    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `${description.replace(/\s+/g, '_')}_screenshot.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Detection Results ({detectedObjects.length} objects found)
          </h3>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {objectTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredObjects.map((object, index) => {
                const ObjectIcon = OBJECT_ICONS[object.type];
                const colorClass = OBJECT_COLORS[object.type];
                
                return (
                  <motion.div
                    key={object.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Screenshot */}
                    <div className="relative group">
                      <img
                        src={object.screenshot}
                        alt={object.description}
                        className="w-full h-48 object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                        onClick={() => setSelectedImage(object.screenshot)}
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = `https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/718096/ffffff?text=${object.type.replace('_', '+').toUpperCase()}+DETECTED`;
                        }}
                      />
                      
                      {/* Object Type Badge */}
                      <div className={`
                        absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm
                        ${colorClass === 'blue' ? 'bg-blue-500/90' : ''}
                        ${colorClass === 'red' ? 'bg-red-500/90' : ''}
                        ${colorClass === 'orange' ? 'bg-orange-500/90' : ''}
                        ${colorClass === 'green' ? 'bg-green-500/90' : ''}
                        ${colorClass === 'purple' ? 'bg-purple-500/90' : ''}
                      `}>
                        <div className="flex items-center space-x-1">
                          <ObjectIcon className="w-3 h-3" />
                          <span>{object.type.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {/* Confidence Badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                        {(object.confidence * 100).toFixed(1)}%
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedImage(object.screenshot)}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          title="View Full Size"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadScreenshot(object.screenshot, object.description)}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          title="Download Screenshot"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {object.description}
                      </h4>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(object.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">
                            {object.coordinates.lat.toFixed(6)}, {object.coordinates.lng.toFixed(6)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>Detection confidence</span>
                        </div>
                      </div>
                      
                      {/* Feedback Section */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {showFeedback === object.id ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3"
                          >
                            <textarea
                              value={feedbackComments[object.id] || ''}
                              onChange={(e) => setFeedbackComments(prev => ({
                                ...prev,
                                [object.id]: e.target.value
                              }))}
                              placeholder="Additional comments (optional)"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                            />
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleFeedback(object.id, true)}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>Accurate</span>
                              </button>
                              
                              <button
                                onClick={() => handleFeedback(object.id, false)}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span>Inaccurate</span>
                              </button>
                              
                              <button
                                onClick={() => setShowFeedback(null)}
                                className="px-3 py-1 text-gray-600 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => setShowFeedback(object.id)}
                            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Provide Feedback</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {filteredObjects.length === 0 && (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No objects found{selectedType !== 'all' ? ` for ${selectedType.replace('_', ' ')}` : ''}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full size screenshot"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
