export interface DetectedObject {
  id: string;
  type: 'pole' | 'pothole' | 'uneven_road' | 'side_barrier' | 'traffic_sign';
  timestamp: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  screenshot: string;
  confidence: number;
  description: string;
}

export interface AnalysisReport {
  id: string;
  videoFile: File;
  uploadTime: Date;
  processingTime: number;
  detectedObjects: DetectedObject[];
  totalFrames: number;
  videoDuration: number;
}

export interface UserFeedback {
  objectId: string;
  isAccurate: boolean;
  comments?: string;
  timestamp: Date;
}
