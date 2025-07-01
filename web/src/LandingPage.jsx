"use client"

import { useState } from "react"
import { MapPin, Link, Heart, Calendar, FileText, Search } from "lucide-react"
import { useAuth } from "./context/AuthContext"
import { AuthPrompt } from "./components/AuthPrompt"

export function LandingPage() {
  const { user } = useAuth()
  const [postUrl, setPostUrl] = useState("")
  const [placeName, setPlaceName] = useState("")
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: URL, 2: Place, 3: Details
  const [placeData, setPlaceData] = useState({
    dateToGo: "",
    description: "",
  })

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    if (!postUrl.trim()) return
    setCurrentStep(2) // Move to place input step
  }

  // Mock Google Places Autocomplete (you'd replace with real Google Places API)
  const handlePlaceSearch = (e) => {
    e.preventDefault()
    if (!placeName.trim()) return

    // Mock place selection with Google Places-like data
    const mockPlace = {
      name: placeName,
      address: `${placeName}, Earth`,
      coordinates: {
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
      },
      placeId: "mock_place_id_" + Date.now(),
    }

    setSelectedPlace(mockPlace)
    setCurrentStep(3) // Move to details step
  }

  const handleSavePlace = () => {
    if (!placeData.dateToGo || !placeData.description) {
      alert("Please fill in the date and description first!")
      return
    }

    if (user) {
      // User is signed in, save the place
      console.log("Saving place:", {
        ...selectedPlace,
        ...placeData,
        originalPostUrl: postUrl,
      })
      alert("Place saved successfully!")
      resetForm()
    } else {
      // User not signed in, show sign up prompt
      setShowAuthPrompt(true)
    }
  }

  const resetForm = () => {
    setPostUrl("")
    setPlaceName("")
    setSelectedPlace(null)
    setCurrentStep(1)
    setPlaceData({ dateToGo: "", description: "" })
  }

  const goBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      if (currentStep === 2) {
        setSelectedPlace(null)
      }
    }
  }

  const getPlatformName = (url) => {
    if (url.includes("instagram")) return "Instagram"
    if (url.includes("tiktok")) return "TikTok"
    if (url.includes("twitter")) return "Twitter"
    return "Social Media"
  }

  const getPlatformIcon = (url) => {
    if (url.includes("instagram")) return "📷"
    if (url.includes("tiktok")) return "🎵"
    if (url.includes("twitter")) return "🐦"
    return "🔗"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-2.5 rounded-2xl">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">pingo</h1>
              <p className="text-sm text-gray-500">Save places from your social media</p>
            </div>
          </div>

          {!user && (
            <button
              onClick={() => setShowAuthPrompt(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Sign Up
            </button>
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? "text-gray-900" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1 ? "bg-gray-900 text-white" : "bg-gray-200"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Paste URL</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center ${currentStep >= 2 ? "text-gray-900" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2 ? "bg-gray-900 text-white" : "bg-gray-200"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Add Place</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center ${currentStep >= 3 ? "text-gray-900" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 3 ? "bg-gray-900 text-white" : "bg-gray-200"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Plan Visit</span>
              </div>
            </div>
          </div>

          {/* Step 1: URL Input */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6">📱🔗</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Start with a Social Media Post</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Found an amazing place on Instagram, TikTok, or Twitter? Paste the post URL below to get started.
              </p>

              <form onSubmit={handleUrlSubmit} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    placeholder="https://instagram.com/p/... or https://tiktok.com/@user/video/..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors font-medium text-lg"
                >
                  Continue
                </button>
              </form>

              {/* Example URLs */}
              <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 mt-6">
                <span>Try with:</span>
                <button
                  onClick={() => setPostUrl("https://instagram.com/p/example123")}
                  className="text-blue-600 hover:underline"
                >
                  Instagram URL
                </button>
                <span>•</span>
                <button
                  onClick={() => setPostUrl("https://tiktok.com/@user/video/example")}
                  className="text-blue-600 hover:underline"
                >
                  TikTok URL
                </button>
                <span>•</span>
                <button
                  onClick={() => setPostUrl("https://twitter.com/user/status/example")}
                  className="text-blue-600 hover:underline"
                >
                  Twitter URL
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Place Input */}
          {currentStep === 2 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🗺️📍</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Place Did You Find?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Tell us the name of the place from your {getPlatformName(postUrl)} post. We'll find it on the map for
                you.
              </p>

              {/* Show linked post */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPlatformIcon(postUrl)}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Linked {getPlatformName(postUrl)} Post</p>
                    <p className="text-xs text-gray-500 truncate">{postUrl}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePlaceSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="Type place name... (e.g., Santorini Greece, Tokyo Japan, Bali Indonesia)"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                    required
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={goBackStep}
                    className="flex-1 px-6 py-4 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-medium text-lg"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors font-medium text-lg"
                  >
                    Find Place
                  </button>
                </div>
              </form>

              <p className="text-sm text-gray-500 mt-4">💡 Tip: We use Google Places to find and verify locations</p>
            </div>
          )}

          {/* Step 3: Details & Map */}
          {currentStep === 3 && selectedPlace && (
            <div>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">✅📍</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Perfect! We Found {selectedPlace.name}</h2>
                <p className="text-lg text-gray-600">Now add your travel plans to complete your wishlist entry.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Map */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Location on Map</h3>
                  <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-100">
                    <div className="text-center">
                      <div className="text-4xl mb-3">📍</div>
                      <h4 className="text-lg font-medium text-gray-700 mb-1">{selectedPlace.name}</h4>
                      <p className="text-gray-400 text-sm">{selectedPlace.address}</p>
                    </div>

                    {/* Mock pin */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg animate-bounce">
                      📍
                    </div>
                  </div>

                  {/* Post reference */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <span className="text-base">{getPlatformIcon(postUrl)}</span>
                      <span>Linked to your {getPlatformName(postUrl)} post</span>
                    </div>
                  </div>
                </div>

                {/* Travel Details Form */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900">Your Travel Plans</h3>
                  </div>

                  <div className="space-y-5">
                    {/* Place Name (Read-only) */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4" />
                        Place
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700">
                        {selectedPlace.name}
                      </div>
                    </div>

                    {/* Date to Go */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        When do you want to go? *
                      </label>
                      <input
                        type="date"
                        value={placeData.dateToGo}
                        onChange={(e) => setPlaceData({ ...placeData, dateToGo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Why do you want to visit? *
                      </label>
                      <textarea
                        value={placeData.description}
                        onChange={(e) => setPlaceData({ ...placeData, description: e.target.value })}
                        placeholder="What caught your attention in the post? What do you want to do there?"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        required
                      />
                    </div>

                    {/* Preview */}
                    {placeData.dateToGo && placeData.description && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Your Travel Plan:</h4>
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>📍 Place:</strong> {selectedPlace.name}
                          </p>
                          <p>
                            <strong>📅 Date:</strong>{" "}
                            {new Date(placeData.dateToGo).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p>
                            <strong>💭 Reason:</strong> {placeData.description}
                          </p>
                          <p>
                            <strong>🔗 Source:</strong> {getPlatformName(postUrl)} post
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={goBackStep}
                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSavePlace}
                        disabled={!placeData.dateToGo || !placeData.description}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Heart className="w-4 h-4" />
                        {user ? "Save Place" : "Save (Sign Up)"}
                      </button>
                    </div>

                    {!user && (
                      <p className="text-center text-sm text-gray-500">
                        Create a free account to save this place to your travel map
                      </p>
                    )}

                    <button
                      onClick={resetForm}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                      Start Over with New Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How it works - only show on step 1 */}
          {currentStep === 1 && (
            <div className="text-center mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">How PinGo Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Link className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Paste URL</h4>
                  <p className="text-gray-600 text-sm">Copy link from Instagram, TikTok, or Twitter</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Add Place</h4>
                  <p className="text-gray-600 text-sm">Tell us the place name from the post</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">3. See on Map</h4>
                  <p className="text-gray-600 text-sm">We find it using Google Places</p>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">4. Plan & Save</h4>
                  <p className="text-gray-600 text-sm">Add dates and save to your wishlist</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sign Up Prompt */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        placeName={selectedPlace?.name}
        placeData={{ ...placeData, originalPostUrl: postUrl }}
      />
    </div>
  )
}
