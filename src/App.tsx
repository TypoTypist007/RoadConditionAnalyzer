import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Shield, AlertTriangle, BarChart3 } from 'lucide-react';
import { VideoUpload } from './components/VideoUpload';
import { ProcessingProgress } from './components/ProcessingProgress';
import { DetectionResults } from './components/DetectionResults';
import { ReportActions } from './components/ReportActions';
import { simulateVideoProcessing } from './utils/mockCV';
import { AnalysisReport, DetectedObject, UserFeedback } from './types';
import { faker } from '@faker-js/faker';

type AppState = 'upload' | 'processing' | 'results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('upload');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('uploading');
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);

  const handleVideoUpload = async (file: File) => {
    setCurrentState('processing');
    setProcessingProgress(0);
    
    // Simulate video duration calculation
    const videoDuration = faker.number.float({ min: 30, max: 600 }); // 30s to 10min
    const totalFrames = Math.floor(videoDuration * 30); // Assuming 30 FPS
    const startTime = Date.now();
    
    try {
      // Simulate processing stages
      setProcessingStage('uploading');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStage('processing');
      setProcessingProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStage('detecting');
      setProcessingProgress(50);
      
      // Run the mock CV processing
      const detectedObjects = await simulateVideoProcessing(
        videoDuration,
        (progress) => {
          setProcessingProgress(50 + (progress * 0.4)); // 50% to 90%
        }
      );
      
      setProcessingStage('generating');
      setProcessingProgress(95);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      const report: AnalysisReport = {
        id: faker.string.uuid(),
        videoFile: file,
        uploadTime: new Date(),
        processingTime,
        detectedObjects,
        totalFrames,
        videoDuration
      };
      
      setCurrentReport(report);
      setProcessingProgress(100);
      
      // Transition to results after a brief delay
      setTimeout(() => {
        setCurrentState('results');
      }, 1000);
      
    } catch (error) {
      console.error('Processing error:', error);
      // Handle error state here
    }
  };

  const handleFeedback = (objectId: string, isAccurate: boolean, comments?: string) => {
    const feedback: UserFeedback = {
      objectId,
      isAccurate,
      comments,
      timestamp: new Date()
    };
    
    setFeedbacks(prev => [...prev, feedback]);
    
    // In a real app, you would send this feedback to your backend
    console.log('Feedback submitted:', feedback);
  };

  const handleNewAnalysis = () => {
    setCurrentState('upload');
    setCurrentReport(null);
    setProcessingProgress(0);
    setProcessingStage('uploading');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Road Condition Analyzer</h1>
                <p className="text-sm text-gray-600">AI-powered road safety analysis</p>
              </div>
            </div>
            
            {currentState === 'results' && (
              <button
                onClick={handleNewAnalysis}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentState === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Analyze Road Conditions with AI
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Upload your road videos and let our advanced computer vision technology 
                  identify potential hazards, safety elements, and maintenance needs.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                  <Shield className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Safety Detection</h3>
                  <p className="text-sm text-gray-600">
                    Identify poles, barriers, and traffic signs for comprehensive safety analysis
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Hazard Identification</h3>
                  <p className="text-sm text-gray-600">
                    Detect potholes, uneven surfaces, and road damage that need attention
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                  <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Detailed Reports</h3>
                  <p className="text-sm text-gray-600">
                    Generate comprehensive reports with timestamps and location data
                  </p>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-6">
                <VideoUpload 
                  onVideoUpload={handleVideoUpload}
                  isProcessing={false}
                />
              </div>
            </motion.div>
          )}

          {currentState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <ProcessingProgress 
                progress={processingProgress}
                stage={processingStage}
              />
            </motion.div>
          )}

          {currentState === 'results' && currentReport && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Analysis Complete
                </h2>
                <p className="text-gray-600">
                  Found {currentReport.detectedObjects.length} objects in {currentReport.videoDuration.toFixed(1)} seconds of video
                </p>
              </div>

              <DetectionResults 
                detectedObjects={currentReport.detectedObjects}
                onFeedback={handleFeedback}
              />
              
              <ReportActions report={currentReport} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Road Condition Analyzer - Enhancing road safety through AI-powered analysis
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
