"use client"

import { useState } from "react"
import { X, MapPin, Calendar, FileText, Link } from "lucide-react"

export function AddPlaceModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    dateToGo: "",
    description: "",
    originalPostUrl: "",
    coordinates: { lat: 0, lng: 0 },
  })

  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Place name is required"
    if (!formData.dateToGo) newErrors.dateToGo = "Date is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.originalPostUrl.trim()) newErrors.originalPostUrl = "Post URL is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // Generate random coordinates for demo (you'd get these from Google Places API)
    const randomCoords = {
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
    }

    onAdd({
      ...formData,
      coordinates: randomCoords,
    })

    // Reset form
    setFormData({
      name: "",
      dateToGo: "",
      description: "",
      originalPostUrl: "",
      coordinates: { lat: 0, lng: 0 },
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
      <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Add New Place</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Place Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Place Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Santorini, Greece"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.name ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Date to Go */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              When do you want to go?
            </label>
            <input
              type="date"
              value={formData.dateToGo}
              onChange={(e) => handleChange("dateToGo", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.dateToGo ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.dateToGo && <p className="text-red-500 text-xs mt-1">{errors.dateToGo}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="What excites you about this place?"
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                errors.description ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Original Post URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Link className="w-4 h-4" />
              Original Post URL
            </label>
            <input
              type="url"
              value={formData.originalPostUrl}
              onChange={(e) => handleChange("originalPostUrl", e.target.value)}
              placeholder="https://instagram.com/p/..."
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.originalPostUrl ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.originalPostUrl && <p className="text-red-500 text-xs mt-1">{errors.originalPostUrl}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Add Place
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
