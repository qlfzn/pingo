"use client"

import { MapPin } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-5">
      <div className="flex items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 p-2.5 rounded-2xl">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">pingo</h1>
            <p className="text-sm text-gray-500">Save places you want to visit</p>
          </div>
        </div>
      </div>
    </header>
  )
}
