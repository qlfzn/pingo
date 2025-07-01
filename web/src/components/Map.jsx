export function Map({ places, onPlaceSelect }) {
  return (
    <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-100">
      {/* Placeholder for Google Maps */}
      <div className="text-center">
        <div className="text-5xl mb-3 opacity-40">🗺️</div>
        <h3 className="text-lg font-medium text-gray-700 mb-1">Interactive Map</h3>
        <p className="text-gray-400 text-sm">Google Maps integration goes here</p>
      </div>

      {/* Mock pins */}
      <div className="absolute top-6 left-6 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">
        📍
      </div>
      <div className="absolute bottom-12 right-12 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">
        📍
      </div>
      <div className="absolute top-1/3 right-1/4 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">
        📍
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 border border-gray-100">
        {places.length} saved places
      </div>
    </div>
  )
}
