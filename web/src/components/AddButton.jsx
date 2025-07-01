"use client"

import { Plus } from "lucide-react"

export function AddButton({ onClick }) {
  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={onClick}
        className="fixed bottom-6 right-6 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl active:scale-95 transition-all duration-200 z-40 md:bottom-8 md:right-8"
        aria-label="Add new place"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile bottom padding to prevent content from being hidden behind FAB */}
      <div className="h-20 md:h-0" />
    </>
  )
}
