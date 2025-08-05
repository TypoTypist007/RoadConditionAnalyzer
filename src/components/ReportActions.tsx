import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Share2, Database } from 'lucide-react';
import { AnalysisReport } from '../types';
import { generatePDFReport, exportReportData } from '../utils/reportGenerator';

interface ReportActionsProps {
  report: AnalysisReport;
}

export const ReportActions: React.FC<ReportActionsProps> = ({ report }) => {
  const handleDownloadPDF = async () => {
    try {
      await generatePDFReport(report);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleExportData = () => {
    exportReportData(report);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Road Condition Analysis Report',
          text: `Analysis report for video uploaded on ${report.uploadTime.toLocaleDateString()}. ${report.detectedObjects.length} objects detected.`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const actions = [
    {
      label: 'Download PDF Report',
      icon: FileText,
      onClick: handleDownloadPDF,
      color: 'blue'
    },
    {
      label: 'Export Raw Data',
      icon: Database,
      onClick: handleExportData,
      color: 'green'
    },
    {
      label: 'Share Report',
      icon: Share2,
      onClick: handleShare,
      color: 'purple'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Download className="w-5 h-5" />
        <span>Export & Share</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const ActionIcon = action.icon;
          
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.onClick}
              className={`
                p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:scale-105 hover:shadow-md
                ${action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' : ''}
                ${action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' : ''}
                ${action.color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50' : ''}
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <ActionIcon className={`
                  w-8 h-8
                  ${action.color === 'blue' ? 'text-blue-500' : ''}
                  ${action.color === 'green' ? 'text-green-500' : ''}
                  ${action.color === 'purple' ? 'text-purple-500' : ''}
                `} />
                <span className="text-sm font-medium text-gray-700">
                  {action.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Report Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Report Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{report.detectedObjects.length}</p>
            <p className="text-xs text-gray-500">Objects Detected</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{report.videoDuration.toFixed(1)}s</p>
            <p className="text-xs text-gray-500">Video Duration</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{report.processingTime.toFixed(1)}s</p>
            <p className="text-xs text-gray-500">Processing Time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{report.totalFrames}</p>
            <p className="text-xs text-gray-500">Frames Analyzed</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
