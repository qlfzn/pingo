"use client"

import { useState } from "react"
import { X, MapPin, Heart, Lock, Calendar, FileText, Link } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export function AuthPrompt({ isOpen, onClose, placeName, placeData }) {
  const { signIn, signUp, isLoading } = useAuth()
  const [authMode, setAuthMode] = useState("signup")
  const [formData, setFormData] = useState({ email: "", password: "", name: "" })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (authMode === "signin") {
      await signIn(formData.email, formData.password)
    } else {
      await signUp(formData.email, formData.password, formData.name)
    }
    onClose()
    setFormData({ email: "", password: "", name: "" })
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
      <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-2 rounded-xl">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Save Your Place</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Place Preview */}
          {placeName && placeData && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-600" />
                Ready to save: {placeName}
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                {placeData.dateToGo && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(placeData.dateToGo).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {placeData.description && (
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="line-clamp-2">{placeData.description}</span>
                  </div>
                )}
                {placeData.originalPostUrl && (
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-gray-400" />
                    <span className="text-blue-600 truncate">Original post linked</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Value proposition */}
          <div className="text-center mb-6">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create your travel wishlist</h3>
            <p className="text-gray-600 text-sm">
              Sign up to save this place and start building your personal travel map with all your dream destinations.
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : authMode === "signin" ? "Sign In & Save" : "Create Account & Save"}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                {authMode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Save unlimited places to your travel map</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Track upcoming trips and past adventures</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Your data is secure and private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
