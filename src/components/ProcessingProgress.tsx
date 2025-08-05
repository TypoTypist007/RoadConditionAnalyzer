import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Eye, Brain, Camera } from 'lucide-react';

interface ProcessingProgressProps {
  progress: number;
  stage: string;
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ progress, stage }) => {
  const stages = [
    { name: 'Uploading', icon: Camera, description: 'Preparing video for analysis' },
    { name: 'Processing', icon: Brain, description: 'Analyzing video frames with computer vision' },
    { name: 'Detecting', icon: Eye, description: 'Identifying road hazards and safety elements' },
    { name: 'Generating', icon: Camera, description: 'Creating screenshots and reports' }
  ];

  const currentStageIndex = stages.findIndex(s => s.name.toLowerCase() === stage.toLowerCase());

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg border border-gray-200 p-8 text-center max-w-md mx-auto"
    >
      <div className="mb-6">
        <Loader2 className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Analyzing Video
      </h3>
      
      <p className="text-gray-600 mb-6">
        {stages[currentStageIndex]?.description || 'Processing your video...'}
      </p>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <motion.div
          className="bg-blue-500 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <p className="text-sm text-gray-500 mb-6">
        {progress.toFixed(1)}% Complete
      </p>
      
      {/* Stage Indicators */}
      <div className="flex justify-center space-x-4">
        {stages.map((stageItem, index) => {
          const StageIcon = stageItem.icon;
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex;
          
          return (
            <div
              key={stageItem.name}
              className={`
                flex flex-col items-center space-y-1 transition-all duration-200
                ${isActive ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-gray-400'}
              `}
            >
              <div className={`
                p-2 rounded-full transition-all duration-200
                ${isActive ? 'bg-blue-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'}
              `}>
                <StageIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">{stageItem.name}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
