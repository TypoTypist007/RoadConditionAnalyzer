import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
  isProcessing: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUpload, isProcessing }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Check file duration (simulate - in real app you'd check actual duration)
      const maxDuration = 10 * 60; // 10 minutes in seconds
      onVideoUpload(file);
    }
  }, [onVideoUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500MB
    disabled: isProcessing
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={!isProcessing ? { scale: 1.02 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isDragActive ? (
            <Upload className="w-12 h-12 text-blue-500 animate-bounce" />
          ) : (
            <Video className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop your video here' : 'Upload Road Video'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop a video file, or click to select
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: MP4, AVI, MOV, MKV, WebM (Max: 10 minutes, 500MB)
            </p>
          </div>
        </div>
      </motion.div>

      {fileRejections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">
              File rejected: {fileRejections[0].errors[0].message}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
