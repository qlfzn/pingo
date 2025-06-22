<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
              <MapPin class="h-6 w-6 text-white" />
            </div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RoaMap 
            </h1>
          </div>
          <div class="hidden md:flex items-center space-x-4">
            <button
              v-if="!isAuthenticated"
              @click="showAuthModal = true"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Sign In
            </button>
            <div v-else class="flex items-center space-x-3">
              <div class="flex items-center bg-white/50 rounded-full px-3 py-2">
                <div class="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-2">
                  <span class="text-white text-sm font-medium">{{ userInitials }}</span>
                </div>
                <span class="text-gray-700 text-sm font-medium">{{ user.name }}</span>
              </div>
              <button
                @click="signOut"
                class="text-gray-600 hover:text-gray-900 text-sm bg-white/50 px-3 py-2 rounded-lg hover:bg-white/70 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="pb-20 md:pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- New Input Section -->
        <div v-show="activeTab === 'input'" class="space-y-6">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Discover Amazing Places
            </h2>
            <p class="text-gray-600">Save locations from your favorite social media posts</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Input Panel -->
            <div class="space-y-6">
              <!-- Social Media Link Input -->
              <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div class="flex items-center mb-4">
                  <div class="bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-lg mr-3">
                    <Star class="h-5 w-5 text-white" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Input Social Media Post</h3>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Paste social media post URL
                    </label>
                    <div class="relative">
                      <input
                        v-model="socialMediaUrl"
                        type="url"
                        placeholder="https://instagram.com/p/... or https://twitter.com/..."
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        @click="parseLocation"
                        :disabled="!socialMediaUrl || isLoading"
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
                        <span v-else>Parse</span>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Supported Platforms -->
                  <div class="flex flex-wrap gap-2">
                    <span class="text-xs text-gray-500">Supported:</span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border border-pink-200">
                      <Instagram class="h-3 w-3 mr-1" />
                      Instagram
                    </span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                      <Twitter class="h-3 w-3 mr-1" />
                      Twitter
                    </span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-200">
                      <Facebook class="h-3 w-3 mr-1" />
                      Facebook
                    </span>
                  </div>
                </div>
              </div>

              <!-- Parsed Location Details -->
              <div v-if="parsedLocation" class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div class="flex items-center mb-4">
                  <div class="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg mr-3">
                    <MapPin class="h-5 w-5 text-white" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Location Found</h3>
                </div>
                
                <div class="space-y-4">
                  <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
                    <div class="flex items-start space-x-3">
                      <div class="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg">
                        <MapPin class="h-4 w-4 text-white" />
                      </div>
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">{{ parsedLocation.name }}</h4>
                        <p class="text-sm text-gray-600 mt-1">{{ parsedLocation.address }}</p>
                        <div class="flex items-center mt-2">
                          <div class="flex items-center bg-yellow-100 px-2 py-1 rounded-full mr-2">
                            <Star class="h-3 w-3 text-yellow-500 mr-1" />
                            <span class="text-xs font-medium text-yellow-800">{{ parsedLocation.rating }}</span>
                          </div>
                          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{{ parsedLocation.category }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Details Form (for authenticated users) -->
                  <div v-if="isAuthenticated" class="space-y-4">
                    <div class="flex items-center">
                      <Heart class="h-4 w-4 text-pink-500 mr-2" />
                      <h4 class="font-medium text-gray-900">Add to Your Collection</h4>
                    </div>
                    
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          v-model="additionalDetails.notes"
                          rows="3"
                          placeholder="Add your thoughts about this place..."
                          class="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <input
                          v-model="tagInput"
                          @keydown.enter.prevent="addTag"
                          placeholder="Add tags (press Enter)"
                          class="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                        <div v-if="additionalDetails.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                          <span
                            v-for="tag in additionalDetails.tags"
                            :key="tag"
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200"
                          >
                            {{ tag }}
                            <button @click="removeTag(tag)" class="ml-1 hover:text-purple-600">
                              <X class="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">When do you want to visit?</label>
                        <input
                          v-model="additionalDetails.visitDate"
                          type="date"
                          class="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <button
                        @click="saveToCollection"
                        class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                      >
                        <Heart class="h-4 w-4 inline mr-2" />
                        Save to My Places
                      </button>
                    </div>
                  </div>

                  <!-- Guest User Prompt -->
                  <div v-else>
                    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                      <div class="flex items-start">
                        <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                          <Info class="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">Want to save this place?</h4>
                          <p class="text-sm text-gray-600 mt-1">
                            Sign up to add notes, tags, and save places to your personal collection.
                          </p>
                          <button
                            @click="showAuthModal = true"
                            class="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                          >
                            Create Account →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map Panel -->
            <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <!-- Map Header -->
              <div class="p-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold">
                    {{ parsedLocation ? 'Location Found' : 'Map View' }}
                  </h3>
                  <div class="flex space-x-2">
                    <button
                      @click="mapView = 'map'"
                      :class="mapView === 'map' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70'"
                      class="px-3 py-1 rounded-lg text-sm transition-all duration-200"
                    >
                      Map
                    </button>
                    <button
                      @click="mapView = 'satellite'"
                      :class="mapView === 'satellite' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70'"
                      class="px-3 py-1 rounded-lg text-sm transition-all duration-200"
                    >
                      Satellite
                    </button>
                  </div>
                </div>
              </div>

              <!-- Simulated Map -->
              <div class="h-96 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 relative">
                <!-- Map Grid Pattern -->
                <div class="absolute inset-0 opacity-20">
                  <div class="grid grid-cols-8 grid-rows-8 h-full w-full">
                    <div v-for="i in 64" :key="i" class="border border-gray-300"></div>
                  </div>
                </div>

                <!-- Location Marker -->
                <div
                  v-if="parsedLocation"
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div class="relative">
                    <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                    <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 whitespace-nowrap border border-white/20">
                      <div class="text-sm font-medium text-gray-900">{{ parsedLocation.name }}</div>
                    </div>
                  </div>
                </div>

                <!-- No Location State -->
                <div v-else class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center text-gray-500">
                    <div class="bg-gradient-to-r from-gray-400 to-gray-500 p-4 rounded-full mb-4 mx-auto w-fit">
                      <MapPin class="h-8 w-8 text-white" />
                    </div>
                    <p class="text-lg font-medium">No location parsed yet</p>
                    <p class="text-sm">Paste a social media URL to get started</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Places Section -->
        <div v-show="activeTab === 'places'" class="space-y-6">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              My Saved Places
            </h2>
            <p class="text-gray-600">Your personal collection of amazing places</p>
          </div>

          <div v-if="isAuthenticated">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="place in savedPlaces"
                :key="place.id"
                @click="selectSavedPlace(place)"
                class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                    <MapPin class="h-5 w-5 text-white" />
                  </div>
                  <Calendar v-if="place.visitDate" class="h-4 w-4 text-gray-400" />
                </div>
                
                <h4 class="font-semibold text-gray-900 mb-2">{{ place.name }}</h4>
                <p class="text-sm text-gray-600 mb-3">{{ place.address }}</p>
                
                <div v-if="place.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="tag in place.tags"
                    :key="tag"
                    class="inline-block px-2 py-1 rounded-full text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <div v-if="place.notes" class="text-sm text-gray-600 italic">
                  "{{ place.notes }}"
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-full mb-6 mx-auto w-fit">
              <Bookmark class="h-12 w-12 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Sign in to view your places</h3>
            <p class="text-gray-600 mb-4">Create an account to save and organize your favorite places</p>
            <button
              @click="showAuthModal = true"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Get Started
            </button>
          </div>
        </div>

        <!-- Map Section -->
        <div v-show="activeTab === 'map'" class="space-y-6">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Explore Map
            </h2>
            <p class="text-gray-600">Discover places around you</p>
          </div>

          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <!-- Map Controls -->
            <div class="p-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">Interactive Map</h3>
                <div class="flex space-x-2">
                  <button
                    @click="mapView = 'map'"
                    :class="mapView === 'map' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70'"
                    class="px-3 py-1 rounded-lg text-sm transition-all duration-200"
                  >
                    Map
                  </button>
                  <button
                    @click="mapView = 'satellite'"
                    :class="mapView === 'satellite' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70'"
                    class="px-3 py-1 rounded-lg text-sm transition-all duration-200"
                  >
                    Satellite
                  </button>
                </div>
              </div>
            </div>

            <!-- Full Map View -->
            <div class="h-96 md:h-[500px] bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 relative">
              <!-- Map Grid Pattern -->
              <div class="absolute inset-0 opacity-20">
                <div class="grid grid-cols-12 grid-rows-12 h-full w-full">
                  <div v-for="i in 144" :key="i" class="border border-gray-300"></div>
                </div>
              </div>

              <!-- Multiple Location Markers -->
              <div class="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div class="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div class="absolute top-2/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div class="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>

              <!-- Current Location -->
              <div v-if="parsedLocation" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div class="relative">
                  <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                  <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 whitespace-nowrap border border-white/20">
                    <div class="text-sm font-medium text-gray-900">{{ parsedLocation.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Section -->
        <div v-show="activeTab === 'profile'" class="space-y-6">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Profile
            </h2>
            <p class="text-gray-600">Manage your account and preferences</p>
          </div>

          <div v-if="isAuthenticated" class="max-w-2xl mx-auto space-y-6">
            <!-- Profile Card -->
            <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div class="flex items-center space-x-4 mb-6">
                <div class="h-16 w-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xl font-bold">{{ userInitials }}</span>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900">{{ user.name }}</h3>
                  <p class="text-gray-600">{{ user.email }}</p>
                </div>
              </div>
              
              <!-- Stats -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div class="text-2xl font-bold text-blue-600">{{ savedPlaces.length }}</div>
                  <div class="text-sm text-gray-600">Saved Places</div>
                </div>
                <div class="text-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
                  <div class="text-2xl font-bold text-green-600">12</div>
                  <div class="text-sm text-gray-600">Visited</div>
                </div>
                <div class="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                  <div class="text-2xl font-bold text-pink-600">8</div>
                  <div class="text-sm text-gray-600">Shared</div>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <button class="w-full text-left p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-900">Edit Profile</span>
                    <span class="text-gray-400">→</span>
                  </div>
                </button>
                <button class="w-full text-left p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-900">Preferences</span>
                    <span class="text-gray-400">→</span>
                  </div>
                </button>
                <button class="w-full text-left p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-900">Export Data</span>
                    <span class="text-gray-400">→</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-full mb-6 mx-auto w-fit">
              <User class="h-12 w-12 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Create your profile</h3>
            <p class="text-gray-600 mb-4">Sign up to access your personal dashboard</p>
            <button
              @click="showAuthModal = true"
              class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/20 z-50 md:hidden">
      <div class="grid grid-cols-4 h-16">
        <button
          @click="activeTab = 'input'"
          :class="activeTab === 'input' ? 'text-purple-600' : 'text-gray-600'"
          class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        >
          <div :class="activeTab === 'input' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-400'" class="p-1.5 rounded-lg">
            <Plus class="h-4 w-4 text-white" />
          </div>
          <span class="text-xs font-medium">New</span>
        </button>
        
        <button
          @click="activeTab = 'places'"
          :class="activeTab === 'places' ? 'text-green-600' : 'text-gray-600'"
          class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        >
          <div :class="activeTab === 'places' ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-400'" class="p-1.5 rounded-lg">
            <Bookmark class="h-4 w-4 text-white" />
          </div>
          <span class="text-xs font-medium">Places</span>
        </button>
        
        <button
          @click="activeTab = 'map'"
          :class="activeTab === 'map' ? 'text-blue-600' : 'text-gray-600'"
          class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        >
          <div :class="activeTab === 'map' ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-gray-400'" class="p-1.5 rounded-lg">
            <MapPin class="h-4 w-4 text-white" />
          </div>
          <span class="text-xs font-medium">Map</span>
        </button>
        
        <button
          @click="activeTab = 'profile'"
          :class="activeTab === 'profile' ? 'text-pink-600' : 'text-gray-600'"
          class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        >
          <div :class="activeTab === 'profile' ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-400'" class="p-1.5 rounded-lg">
            <User class="h-4 w-4 text-white" />
          </div>
          <span class="text-xs font-medium">Profile</span>
        </button>
      </div>
    </nav>

    <!-- Desktop Navigation (hidden on mobile) -->
    <nav class="hidden md:block fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 px-6 py-3">
        <div class="flex space-x-6">
          <button
            @click="activeTab = 'input'"
            :class="activeTab === 'input' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-gray-900'"
            class="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <Plus class="h-4 w-4" />
            <span class="font-medium">New Input</span>
          </button>
          
          <button
            @click="activeTab = 'places'"
            :class="activeTab === 'places' ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-gray-900'"
            class="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <Bookmark class="h-4 w-4" />
            <span class="font-medium">My Places</span>
          </button>
          
          <button
            @click="activeTab = 'map'"
            :class="activeTab === 'map' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'"
            class="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <MapPin class="h-4 w-4" />
            <span class="font-medium">Map</span>
          </button>
          
          <button
            @click="activeTab = 'profile'"
            :class="activeTab === 'profile' ? 'text-pink-600 bg-pink-50' : 'text-gray-600 hover:text-gray-900'"
            class="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <User class="h-4 w-4" />
            <span class="font-medium">Profile</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Authentication Modal -->
    <div v-if="showAuthModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {{ authMode === 'signin' ? 'Welcome Back' : 'Join PlaceParser' }}
            </h3>
            <button @click="showAuthModal = false" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <X class="h-5 w-5" />
            </button>
          </div>
          
          <form @submit.prevent="handleAuth" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="authForm.email"
                type="email"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                v-model="authForm.password"
                type="password"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              {{ authMode === 'signin' ? 'Sign In' : 'Create Account' }}
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <button
              @click="authMode = authMode === 'signin' ? 'signup' : 'signin'"
              class="text-sm text-purple-600 hover:text-purple-500 transition-colors duration-200"
            >
              {{ authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  MapPin,
  Bookmark,
  Instagram,
  Twitter,
  Facebook,
  Star,
  Heart,
  Info,
  Calendar,
  X,
  Loader2,
  Plus,
  User
} from 'lucide-vue-next'

// State
const activeTab = ref('input')
const socialMediaUrl = ref('')
const isLoading = ref(false)
const parsedLocation = ref(null)
const isAuthenticated = ref(false)
const showAuthModal = ref(false)
const authMode = ref('signin')
const mapView = ref('map')
const tagInput = ref('')

// User data
const user = ref({ name: 'John Doe', email: 'john@example.com' })
const userInitials = computed(() => {
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

// Forms
const authForm = ref({
  email: '',
  password: ''
})

const additionalDetails = ref({
  notes: '',
  tags: [],
  visitDate: ''
})

// Saved places
const savedPlaces = ref([
  {
    id: 1,
    name: 'Blue Bottle Coffee',
    address: '123 Main St, San Francisco, CA',
    tags: ['coffee', 'work-friendly'],
    visitDate: '2024-01-15',
    notes: 'Great for morning meetings'
  },
  {
    id: 2,
    name: 'Golden Gate Park',
    address: 'Golden Gate Park, San Francisco, CA',
    tags: ['nature', 'weekend'],
    visitDate: '2024-02-01',
    notes: 'Perfect for weekend walks'
  },
  {
    id: 3,
    name: 'Tartine Bakery',
    address: '600 Guerrero St, San Francisco, CA',
    tags: ['bakery', 'brunch'],
    visitDate: '2024-01-20',
    notes: 'Amazing pastries and coffee'
  }
])

// Methods
const parseLocation = async () => {
  if (!socialMediaUrl.value) return
  
  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    parsedLocation.value = {
      name: 'Artisan Coffee Roasters',
      address: '456 Valencia St, San Francisco, CA 94103',
      rating: 4.5,
      category: 'Coffee Shop',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    }
    isLoading.value = false
  }, 2000)
}

const addTag = () => {
  if (tagInput.value.trim() && !additionalDetails.value.tags.includes(tagInput.value.trim())) {
    additionalDetails.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag) => {
  additionalDetails.value.tags = additionalDetails.value.tags.filter(t => t !== tag)
}

const saveToCollection = () => {
  if (!parsedLocation.value) return
  
  const newPlace = {
    id: Date.now(),
    ...parsedLocation.value,
    ...additionalDetails.value
  }
  
  savedPlaces.value.unshift(newPlace)
  
  // Reset form
  additionalDetails.value = {
    notes: '',
    tags: [],
    visitDate: ''
  }
  
  alert('Place saved to your collection!')
}

const selectSavedPlace = (place) => {
  parsedLocation.value = place
  activeTab.value = 'input'
}

const handleAuth = () => {
  // Simulate authentication
  isAuthenticated.value = true
  showAuthModal.value = false
  authForm.value = { email: '', password: '' }
}

const signOut = () => {
  isAuthenticated.value = false
  activeTab.value = 'input'
}
</script>