import React, { useState } from 'react';
import { MapPin, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface GPSInputProps {
  onGPSChange: (gps: { lat: number; lng: number } | null) => void;
  disabled?: boolean;
}

export const GPSInput: React.FC<GPSInputProps> = ({ onGPSChange, disabled }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);

  const handleCoordinateChange = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      onGPSChange({ lat, lng });
    } else {
      onGPSChange(null);
    }
  };

  const autoDetectLocation = () => {
    setIsAutoDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat.toString());
          setLongitude(lng.toString());
          onGPSChange({ lat, lng });
          setIsAutoDetecting(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsAutoDetecting(false);
        }
      );
    } else {
      setIsAutoDetecting(false);
    }
  };

  React.useEffect(() => {
    handleCoordinateChange();
  }, [latitude, longitude]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-medium text-gray-900">GPS Coordinates</h3>
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Optional: Add GPS data for geospatial reference
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g., 37.7749"
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g., -122.4194"
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>
      
      <button
        onClick={autoDetectLocation}
        disabled={disabled || isAutoDetecting}
        className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isAutoDetecting ? 'Detecting...' : 'Auto-Detect Location'}
      </button>
    </motion.div>
  );
};
