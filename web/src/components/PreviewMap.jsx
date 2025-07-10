import { useRef, useState, useEffect } from "react";
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';
import { MapPin } from "lucide-react";

function PreviewMap({ selectedPlace }) {
  const mapRef = useRef(null);
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const [position, setPosition] = useState({ lat: 3.1319, lng: 101.6841 });
  
  useEffect(() => {
    if (selectedPlace && mapRef.current) {
        position = setPosition(selectedPlace)
    }
  }, [selectedPlace]);

  return (
    <div className="h-80 bg-gray-200 rounded-lg relative overflow-hidden">
      {selectedPlace ? (
        <div className="h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
            <APIProvider apiKey={GOOGLE_API_KEY} onLoad={() => console.log('Maps API has loaded')} >
                <Map center={position} zoom={14} mapId="RESULT_MAP_ID">
                        <AdvancedMarker position={position} />
                </Map>
            </APIProvider>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Select a place to preview location</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewMap;