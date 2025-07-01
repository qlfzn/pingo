"use client"

import { useState } from "react"
import { mockPlaces } from "./data/mockPlaces"
import { Header } from "./components/Header"
import { Map } from "./components/Map"
import { PlacesList } from "./components/PlacesList"
import { AddPlaceModal } from "./components/AddPlaceModal"
import { AddButton } from "./components/AddButton"

export default function Dashboard() {
  const [places, setPlaces] = useState(mockPlaces)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddPlace = () => {
    setIsAddModalOpen(true)
  }

  const handleAddPlaceSubmit = (newPlaceData) => {
    const newPlace = {
      ...newPlaceData,
      id: Date.now().toString(), // Simple ID generation for demo
      createdAt: new Date().toISOString(),
    }
    setPlaces((prev) => [newPlace, ...prev])
  }

  const handleEditPlace = (place) => {
    console.log("Edit place:", place)
    alert(`Edit ${place.name} functionality would go here!`)
  }

  const handleDeletePlace = (placeId) => {
    const placeToDelete = places.find((p) => p.id === placeId)
    if (placeToDelete && confirm(`Are you sure you want to delete ${placeToDelete.name}?`)) {
      setPlaces(places.filter((p) => p.id !== placeId))
    }
  }

  const handlePlaceSelect = (place) => {
    console.log("Selected place:", place)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-4 md:p-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Map Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Your Travel Map</h2>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{places.length} places</span>
            </div>
            <div className="h-96 md:h-[500px]">
              <Map places={places} onPlaceSelect={handlePlaceSelect} />
            </div>
          </div>

          {/* Places List Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Saved Places</h2>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                {places.length} {places.length === 1 ? "place" : "places"}
              </div>
            </div>
            <div className="min-h-[400px]">
              <PlacesList places={places} onEdit={handleEditPlace} onDelete={handleDeletePlace} />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Add Button */}
      <AddButton onClick={handleAddPlace} />

      {/* Add Place Modal */}
      <AddPlaceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddPlaceSubmit} />
    </div>
  )
}
