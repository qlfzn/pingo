"use client"

import { Calendar, MapPin, ExternalLink, Edit, Trash2 } from "lucide-react"

export function PlaceCard({ place, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPlatformIcon = (url) => {
    if (url.includes("instagram")) return "📷"
    if (url.includes("tiktok")) return "🎵"
    if (url.includes("twitter")) return "🐦"
    return "🔗"
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:border-gray-200 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{place.name}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(place)}
            className="p-3 md:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit place"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(place.id)}
            className="p-3 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete place"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">{formatDate(place.dateToGo)}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-5 leading-relaxed">{place.description}</p>

      {/* Original post link */}
      <a
        href={place.originalPostUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
      >
        <span className="text-base">{getPlatformIcon(place.originalPostUrl)}</span>
        <span>View original post</span>
        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
  )
}
