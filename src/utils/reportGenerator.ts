import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AnalysisReport } from '../types';

export const generatePDFReport = async (report: AnalysisReport): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Header
  pdf.setFontSize(20);
  pdf.text('Road Condition Analysis Report', pageWidth / 2, 30, { align: 'center' });
  
  // Report details
  pdf.setFontSize(12);
  pdf.text(`Report ID: ${report.id}`, 20, 50);
  pdf.text(`Upload Time: ${report.uploadTime.toLocaleString()}`, 20, 60);
  pdf.text(`Video Duration: ${report.videoDuration.toFixed(2)} seconds`, 20, 70);
  pdf.text(`Processing Time: ${report.processingTime.toFixed(2)} seconds`, 20, 80);
  pdf.text(`Total Objects Detected: ${report.detectedObjects.length}`, 20, 90);
  
  // Summary by type
  const objectCounts = report.detectedObjects.reduce((acc, obj) => {
    acc[obj.type] = (acc[obj.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let yPos = 110;
  pdf.setFontSize(14);
  pdf.text('Detection Summary:', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(10);
  Object.entries(objectCounts).forEach(([type, count]) => {
    pdf.text(`${type.replace('_', ' ').toUpperCase()}: ${count}`, 30, yPos);
    yPos += 8;
  });
  
  // Add new page for detailed detections
  pdf.addPage();
  pdf.setFontSize(14);
  pdf.text('Detailed Detections:', 20, 30);
  
  yPos = 50;
  report.detectedObjects.forEach((obj, index) => {
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      yPos = 30;
    }
    
    pdf.setFontSize(10);
    pdf.text(`${index + 1}. ${obj.description}`, 20, yPos);
    pdf.text(`Type: ${obj.type.replace('_', ' ')}`, 30, yPos + 8);
    pdf.text(`Time: ${obj.timestamp.toFixed(2)}s`, 30, yPos + 16);
    pdf.text(`Confidence: ${(obj.confidence * 100).toFixed(1)}%`, 30, yPos + 24);
    pdf.text(`Location: ${obj.coordinates.lat.toFixed(6)}, ${obj.coordinates.lng.toFixed(6)}`, 30, yPos + 32);
    
    yPos += 50;
  });
  
  pdf.save(`road-analysis-report-${report.id}.pdf`);
};

export const exportReportData = (report: AnalysisReport): void => {
  const data = {
    reportId: report.id,
    uploadTime: report.uploadTime.toISOString(),
    videoDuration: report.videoDuration,
    processingTime: report.processingTime,
    detectedObjects: report.detectedObjects.map(obj => ({
      type: obj.type,
      timestamp: obj.timestamp,
      coordinates: obj.coordinates,
      confidence: obj.confidence,
      description: obj.description
    }))
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `road-analysis-data-${report.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
