"use client"

import { Eye, ArrowRight } from "lucide-react"

export function PreviewBanner({ onSignUp }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">You're in preview mode</p>
              <p className="text-xs text-gray-600">Try adding places, but sign up to save them forever</p>
            </div>
          </div>
          <button
            onClick={onSignUp}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Sign Up Free
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
