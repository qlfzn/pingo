import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ExternalLink, User, Plus } from 'lucide-react';
import Header from '../components/Header';
import PreviewMap from '../components/PreviewMap';
import { Loader } from '@googlemaps/js-api-loader';

function LandingPage() {
  const [referenceUrl, setReferenceUrl] = useState('');
  const [placeQuery, setPlaceQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [notes, setNotes] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  useEffect(() => {
    let loader;
    let autocompleteService;
    let isMounted = true;

    if (GOOGLE_API_KEY && placeQuery) {
      loader = new Loader({ apiKey: GOOGLE_API_KEY, libraries: ['places'] });
      loader.load().then(() => {
        if (!isMounted) return;
        if (!autocompleteService) {
          autocompleteService = new window.google.maps.places.AutocompleteService();
        }
        setIsSearching(true);
        autocompleteService.getPlacePredictions(
          { input: placeQuery, types: ['establishment'] },
          (preds, status) => {
            setIsSearching(false);
            if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
              setPredictions(preds);
            } else {
              setPredictions([]);
            }
          }
        );
      });
    } else {
      setPredictions([]);
    }

    return () => {
      isMounted = false;
    };
  }, [placeQuery, GOOGLE_API_KEY]);

  const handlePredictionClick = (prediction) => {
    const loader = new Loader({ apiKey: GOOGLE_API_KEY, libraries: ['places'] });
    loader.load().then(() => {
      const map = document.createElement('div'); // dummy div
      const service = new window.google.maps.places.PlacesService(map);
      service.getDetails({ placeId: prediction.place_id }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry) {
          setSelectedPlace({
            place_id: place.place_id,
            name: place.name,
            formatted_address: place.formatted_address,
            rating: place.rating || null,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            types: place.types || [],
          });
          setPlaceQuery(place.name);
          setPredictions([]);
        }
      });
    });
  };

  const handleSave = () => {
    if (!selectedPlace) return;
    
    // For guests, show sign-up prompt
    setShowSavePrompt(true);
  };

  const resetForm = () => {
    setReferenceUrl('');
    setPlaceQuery('');
    setSelectedPlace(null);
    setNotes('');
    setPlannedDate('');
    setSearchResults([]);
    setShowSavePrompt(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="max-w-2xl mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Save places from social media</h1>
            <p className="text-gray-600 text-sm">Add the post URL and search for the place to create a perfect reference with location details.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="space-y-6">
                {/* Reference URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={referenceUrl}
                      onChange={(e) => setReferenceUrl(e.target.value)}
                      placeholder="Paste TikTok, Instagram, or any social media link..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ExternalLink className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Place Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={placeQuery}
                      onChange={(e) => setPlaceQuery(e.target.value)}
                      placeholder="Search for a place..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    {(predictions.length > 0 || isSearching) && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isSearching ? (
                          <div className="p-3 text-center text-gray-500">Searching...</div>
                        ) : (
                          predictions.map((prediction) => (
                            <button
                              key={prediction.place_id}
                              onClick={() => handlePredictionClick(prediction)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div className="font-medium text-sm">{prediction.structured_formatting.main_text}</div>
                                  <div className="text-xs text-gray-500">{prediction.structured_formatting.secondary_text}</div>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Why do you want to visit this place?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Planned Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planned Visit Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={!selectedPlace}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Save Place
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Map Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location Preview</h3>
              <PreviewMap selectedPlace={selectedPlace} />
              
              {selectedPlace && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Selected Place</h4>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{selectedPlace.name}</p>
                    <p className="text-xs text-gray-600">{selectedPlace.formatted_address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">⭐</span>
                        <span className="text-xs font-medium">{selectedPlace.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Save Prompt Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Save to Your Collection</h3>
              <p className="text-gray-600 text-sm mb-6">
                Create an account to save places and access them anytime, anywhere.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSavePrompt(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowSavePrompt(false);
                    // In real app, redirect to sign up
                    alert('Redirect to sign up page');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;