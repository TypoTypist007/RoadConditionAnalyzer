import { faker } from '@faker-js/faker';
import { DetectedObject } from '../types';

const OBJECT_TYPES: DetectedObject['type'][] = [
  'pole',
  'pothole', 
  'uneven_road',
  'side_barrier',
  'traffic_sign'
];

const OBJECT_DESCRIPTIONS = {
  pole: ['Utility pole', 'Street lamp', 'Traffic light pole', 'Sign post'],
  pothole: ['Large pothole', 'Small pothole', 'Medium pothole', 'Deep pothole'],
  uneven_road: ['Road bump', 'Uneven surface', 'Road crack', 'Surface irregularity'],
  side_barrier: ['Guard rail', 'Concrete barrier', 'Metal barrier', 'Safety barrier'],
  traffic_sign: ['Stop sign', 'Speed limit sign', 'Warning sign', 'Direction sign']
};

// Realistic road condition screenshots
const REALISTIC_SCREENSHOTS = {
  pole: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1574263867128-d7a1b9c0c7e5?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1519455953755-af066f52f1a6?w=400&h=300&fit=crop&crop=center'
  ],
  pothole: [
    'https://images.unsplash.com/photo-1583512603805-3cc6b41f3efd?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578728325806-33b6b6bc1ea5?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center'
  ],
  uneven_road: [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=300&fit=crop&crop=center'
  ],
  side_barrier: [
    'https://images.unsplash.com/photo-1578728328007-c3b79b2b4eba?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1517654443271-18c6db45c87c?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1586952518485-11b180e92764?w=400&h=300&fit=crop&crop=center'
  ],
  traffic_sign: [
    'https://images.unsplash.com/photo-1578728328007-c3b79b2b4eba?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1517654443271-18c6db45c87c?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'
  ]
};

// Fallback placeholder generator for when Unsplash images fail
const generateFallbackScreenshot = (type: DetectedObject['type']): string => {
  const colors = {
    pole: '4A5568',
    pothole: '8B4513',
    uneven_road: '718096',
    side_barrier: '2D3748',
    traffic_sign: 'E53E3E'
  };
  
  const text = type.replace('_', '+').toUpperCase();
  return `https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/${colors[type]}/ffffff?text=${text}+DETECTED`;
};

export const generateMockScreenshot = (type: DetectedObject['type']): string => {
  try {
    // Try to get a realistic screenshot first
    const screenshots = REALISTIC_SCREENSHOTS[type];
    if (screenshots && screenshots.length > 0) {
      return faker.helpers.arrayElement(screenshots);
    }
  } catch (error) {
    console.warn('Failed to load realistic screenshot, using fallback');
  }
  
  // Fallback to placeholder
  return generateFallbackScreenshot(type);
};

// Enhanced screenshot generator with timestamp overlay
export const generateTimestampedScreenshot = (type: DetectedObject['type'], timestamp: number): string => {
  const baseUrl = generateMockScreenshot(type);
  
  // Add timestamp as a query parameter for variety
  const timestampParam = `t=${Math.floor(timestamp)}`;
  const separator = baseUrl.includes('?') ? '&' : '?';
  
  return `${baseUrl}${separator}${timestampParam}`;
};

export const simulateVideoProcessing = async (
  videoDuration: number,
  onProgress?: (progress: number) => void
): Promise<DetectedObject[]> => {
  const detectedObjects: DetectedObject[] = [];
  const totalObjects = faker.number.int({ min: 8, max: 25 });
  
  // Generate a base location for the road (simulated)
  const baseLocation = {
    lat: faker.location.latitude(),
    lng: faker.location.longitude()
  };
  
  for (let i = 0; i < totalObjects; i++) {
    if (onProgress) {
      onProgress((i / totalObjects) * 100);
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const type = faker.helpers.arrayElement(OBJECT_TYPES);
    const timestamp = faker.number.float({ min: 0, max: videoDuration });
    
    const object: DetectedObject = {
      id: faker.string.uuid(),
      type,
      timestamp,
      coordinates: {
        // Generate coordinates along a simulated road path
        lat: baseLocation.lat + faker.number.float({ min: -0.01, max: 0.01 }),
        lng: baseLocation.lng + faker.number.float({ min: -0.01, max: 0.01 })
      },
      screenshot: generateTimestampedScreenshot(type, timestamp),
      confidence: faker.number.float({ min: 0.7, max: 0.99 }),
      description: faker.helpers.arrayElement(OBJECT_DESCRIPTIONS[type])
    };
    
    detectedObjects.push(object);
  }
  
  if (onProgress) {
    onProgress(100);
  }
  
  // Sort by timestamp
  return detectedObjects.sort((a, b) => a.timestamp - b.timestamp);
};
