<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Minimal Header -->
    <header class="bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex justify-between items-center h-14">
          <div class="flex items-center space-x-3">
            <div class="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <MapPin class="h-4 w-4 text-white" />
            </div>
            <span class="font-medium text-gray-900 tracking-tight">PlaceParser</span>
          </div>
          
          <div class="hidden md:flex items-center space-x-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="activeTab === tab.id ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-700'"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="flex items-center space-x-3">
            <button
              v-if="!isAuthenticated"
              @click="showAuthModal = true"
              class="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Sign in
            </button>
            <div v-else class="flex items-center space-x-2">
              <div class="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-medium">{{ userInitials }}</span>
              </div>
              <button
                @click="signOut"
                class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pb-20 md:pb-8">
      <div class="max-w-6xl mx-auto px-6 py-8">
        
        <!-- Add Place Section -->
        <div v-show="activeTab === 'add'" class="space-y-8">
          <div class="max-w-2xl">
            <h1 class="text-2xl font-semibold text-gray-900 mb-2">Save places from social media</h1>
            <p class="text-gray-600 text-sm">Add the post URL and search for the place to create a perfect reference with location details.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <!-- Input Column -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Combined Input Form -->
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <div class="space-y-6">
                  <!-- Social Media URL - Primary Input -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="block text-sm font-medium text-gray-900">Social media post</label>
                      <div class="flex items-center space-x-1">
                        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span class="text-xs text-blue-600 font-medium">Recommended</span>
                      </div>
                    </div>
                    <input
                      v-model="socialMediaUrl"
                      @input="onSocialUrlChange"
                      type="url"
                      placeholder="https://instagram.com/p/... or https://tiktok.com/@..."
                      class="w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-0 bg-transparent transition-colors"
                    />
                    <div class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                      <Instagram class="h-3 w-3" />
                      <Twitter class="h-3 w-3" />
                      <span class="w-3 h-3 bg-gray-400 rounded-sm flex items-center justify-center text-[8px] font-bold text-white">T</span>
                      <span>• Helps you remember exactly which post inspired you</span>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-xs text-gray-500">
                      <span class="bg-white px-2">and</span>
                    </div>
                  </div>

                  <!-- Place Search - Secondary but Important -->
                  <div>
                    <label class="block text-sm font-medium text-gray-900 mb-2">Search for the place</label>
                    <input
                      v-model="placeSearchQuery"
                      @input="searchPlaces"
                      type="text"
                      placeholder="Type the place name from the post..."
                      class="w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-0 bg-transparent transition-colors"
                    />
                    <div class="mt-2 text-xs text-gray-500">
                      We'll find the exact location and details for you
                    </div>
                  </div>

                  <!-- Search Results -->
                  <div v-if="searchResults.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
                    <div class="text-xs font-medium text-gray-700 mb-2">Found places:</div>
                    <div
                      v-for="result in searchResults"
                      :key="result.id"
                      @click="selectPlace(result)"
                      class="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all duration-200"
                    >
                      <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-medium text-gray-900 text-sm">{{ result.name }}</h4>
                          <p class="text-xs text-gray-500 mt-1">{{ result.address }}</p>
                          <div class="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                            <span v-if="result.rating" class="flex items-center">
                              <Star class="h-3 w-3 mr-1 text-yellow-400" />
                              {{ result.rating }}
                            </span>
                            <span>{{ result.category }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Loading State -->
                  <div v-if="isSearching" class="text-center py-4">
                    <div class="text-sm text-gray-500">Searching places...</div>
                  </div>

                  <!-- Helpful Tips -->
                  <div v-if="!socialMediaUrl && !placeSearchQuery" class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div class="flex items-start space-x-3">
                      <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lightbulb class="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-blue-900 mb-1">Pro tip</h4>
                        <p class="text-sm text-blue-700">
                          Start with the social media post URL - it helps you remember exactly why you wanted to visit this place!
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- URL Added Confirmation -->
                  <div v-if="socialMediaUrl && !selectedPlace" class="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div class="flex items-start space-x-3">
                      <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check class="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-green-900 mb-1">Great! Post saved</h4>
                        <p class="text-sm text-green-700">
                          Now search for the place name to add location details
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Place Details -->
              <div v-if="selectedPlace" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-medium text-gray-900">Perfect match!</h3>
                    <button @click="selectedPlace = null" class="text-gray-400 hover:text-gray-600">
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                  
                  <!-- Combined Reference Preview -->
                  <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-100">
                    <div class="flex items-start space-x-3">
                      <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Link class="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-gray-900 mb-1">{{ selectedPlace.name }}</h4>
                        <p class="text-xs text-gray-600 mb-2">{{ selectedPlace.address }}</p>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2 text-xs text-gray-500">
                            <Star class="h-3 w-3 text-yellow-400" />
                            <span>{{ selectedPlace.rating }} • {{ selectedPlace.category }}</span>
                          </div>
                          <div v-if="socialMediaUrl" class="flex items-center text-xs text-blue-600">
                            <ExternalLink class="h-3 w-3 mr-1" />
                            <span>Post linked</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Details -->
                  <div v-if="selectedPlace.hours || selectedPlace.phone" class="text-xs text-gray-500 mb-4 space-y-1">
                    <div v-if="selectedPlace.hours" class="flex items-center">
                      <Clock class="h-3 w-3 mr-2" />
                      {{ selectedPlace.hours }}
                    </div>
                    <div v-if="selectedPlace.phone" class="flex items-center">
                      <Phone class="h-3 w-3 mr-2" />
                      {{ selectedPlace.phone }}
                    </div>
                  </div>
                </div>

                <!-- Save Form (Authenticated Users) -->
                <div v-if="isAuthenticated" class="border-t border-gray-100 p-6 bg-gray-50/50">
                  <div class="space-y-4">
                    <textarea
                      v-model="additionalDetails.notes"
                      rows="2"
                      placeholder="What caught your attention about this place?"
                      class="w-full px-0 py-2 text-sm text-gray-900 placeholder-gray-400 border-0 border-b border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0 bg-transparent resize-none"
                    ></textarea>
                    
                    <div class="flex items-center space-x-3">
                      <input
                        v-model="tagInput"
                        @keydown.enter.prevent="addTag"
                        placeholder="Add tags..."
                        class="flex-1 px-0 py-1 text-sm text-gray-900 placeholder-gray-400 border-0 border-b border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0 bg-transparent"
                      />
                      <input
                        v-model="additionalDetails.visitDate"
                        type="date"
                        class="text-sm text-gray-600 border-0 border-b border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0 bg-transparent"
                      />
                    </div>

                    <div v-if="additionalDetails.tags.length > 0" class="flex flex-wrap gap-1">
                      <span
                        v-for="tag in additionalDetails.tags"
                        :key="tag"
                        class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                      >
                        {{ tag }}
                        <button @click="removeTag(tag)" class="ml-1 hover:text-gray-900">
                          <X class="h-2 w-2" />
                        </button>
                      </span>
                    </div>

                    <button
                      @click="savePlace"
                      class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Save place with post reference
                    </button>
                  </div>
                </div>

                <!-- Guest Prompt -->
                <div v-else class="border-t border-gray-100 p-6 bg-gray-50/50">
                  <div class="text-center">
                    <p class="text-sm text-gray-600 mb-3">Want to save this place with its social reference?</p>
                    <button
                      @click="showAuthModal = true"
                      class="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Create account →
                    </button>
                  </div>
                </div>
              </div>

              <!-- Missing URL Warning -->
              <div v-if="selectedPlace && !socialMediaUrl" class="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div class="flex items-start space-x-3">
                  <AlertTriangle class="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 class="text-sm font-medium text-amber-900 mb-1">Consider adding the post URL</h4>
                    <p class="text-sm text-amber-700">
                      You'll remember this place better with the original post that inspired you to visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map Column -->
            <div class="lg:col-span-3">
              <div class="bg-white rounded-xl border border-gray-200 overflow-hidden h-96 lg:h-[500px]">
                <!-- Map Controls -->
                <div class="flex items-center justify-between p-4 border-b border-gray-100">
                  <span class="text-sm font-medium text-gray-900">
                    {{ selectedPlace ? selectedPlace.name : 'Location preview' }}
                  </span>
                  <div class="flex items-center space-x-1">
                    <button
                      @click="mapView = 'map'"
                      :class="mapView === 'map' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                      class="px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Map
                    </button>
                    <button
                      @click="mapView = 'satellite'"
                      :class="mapView === 'satellite' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                      class="px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Satellite
                    </button>
                  </div>
                </div>

                <!-- Map Area -->
                <div class="relative h-full bg-gray-100">
                  <!-- Grid Pattern -->
                  <div class="absolute inset-0 opacity-30">
                    <div class="grid grid-cols-12 grid-rows-12 h-full w-full">
                      <div v-for="i in 144" :key="i" class="border-r border-b border-gray-200 last:border-r-0"></div>
                    </div>
                  </div>

                  <!-- Location Pin -->
                  <div
                    v-if="selectedPlace"
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div class="relative">
                      <div class="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 whitespace-nowrap">
                        <div class="text-xs font-medium text-gray-900">{{ selectedPlace.name }}</div>
                        <div v-if="socialMediaUrl" class="text-xs text-blue-600 flex items-center mt-1">
                          <ExternalLink class="h-2 w-2 mr-1" />
                          Post linked
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Search Results on Map -->
                  <div v-else-if="searchResults.length > 0" class="absolute inset-0">
                    <div
                      v-for="(result, index) in searchResults.slice(0, 5)"
                      :key="result.id"
                      :style="{ 
                        top: `${20 + index * 15}%`, 
                        left: `${30 + index * 10}%` 
                      }"
                      class="absolute"
                    >
                      <div class="w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"></div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <MapPin class="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 class="text-lg font-medium text-gray-900 mb-2">Add your first place</h3>
                      <p class="text-sm text-gray-500 max-w-xs">
                        Paste a social media post and search for the place to see it here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Section -->
        <div v-show="activeTab === 'upcoming'" class="space-y-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900 mb-2">Upcoming adventures</h1>
              <p class="text-gray-600 text-sm">{{ upcomingPlaces.length }} places planned</p>
            </div>
            <div class="text-xs text-gray-400">
              {{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}
            </div>
          </div>

          <div v-if="isAuthenticated">
            <div v-if="upcomingPlaces.length > 0" class="space-y-8">
              <!-- Timeline Feed -->
              <div v-for="group in groupedUpcomingPlaces" :key="group.period" class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 class="text-sm font-medium text-gray-900 uppercase tracking-wide">{{ group.period }}</h3>
                  <div class="flex-1 h-px bg-gray-200"></div>
                </div>

                <div class="space-y-3 ml-5">
                  <div
                    v-for="place in group.places"
                    :key="place.id"
                    @click="selectSavedPlace(place)"
                    class="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                  >
                    <!-- Time indicator -->
                    <div class="absolute top-0 left-0 w-1 h-full" :class="getTimeIndicatorColor(place.visitDate)"></div>
                    
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                          <h3 class="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{{ place.name }}</h3>
                          <span v-if="getDaysUntil(place.visitDate) <= 7" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800">
                            {{ getDaysUntil(place.visitDate) === 0 ? 'Today' : getDaysUntil(place.visitDate) === 1 ? 'Tomorrow' : `${getDaysUntil(place.visitDate)} days` }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-500 mb-2">{{ place.address }}</p>
                        
                        <div class="flex items-center space-x-4 text-xs text-gray-400">
                          <span class="flex items-center">
                            <Calendar class="h-3 w-3 mr-1" />
                            {{ formatVisitDate(place.visitDate) }}
                          </span>
                          <span v-if="place.tags.length > 0" class="flex items-center">
                            <Tag class="h-3 w-3 mr-1" />
                            {{ place.tags.slice(0, 2).join(', ') }}
                          </span>
                          <a v-if="place.socialMediaUrl" :href="place.socialMediaUrl" target="_blank" @click.stop class="flex items-center hover:text-blue-600 transition-colors">
                            <ExternalLink class="h-3 w-3 mr-1" />
                            View post
                          </a>
                        </div>
                      </div>
                      
                      <div class="flex flex-col items-end space-y-2">
                        <div class="text-xs text-gray-400">
                          {{ getWeatherHint(place.visitDate) }}
                        </div>
                        <div class="w-2 h-2 bg-green-500 rounded-full opacity-60"></div>
                      </div>
                    </div>

                    <div v-if="place.notes" class="text-sm text-gray-600 italic mb-3 pl-4 border-l-2 border-gray-100">
                      "{{ place.notes }}"
                    </div>

                    <!-- Action hints -->
                    <div class="flex items-center justify-between text-xs text-gray-400">
                      <span>{{ place.socialMediaUrl ? 'Inspired by social post' : 'No post reference' }}</span>
                      <div class="flex items-center space-x-1">
                        <span v-if="getDaysUntil(place.visitDate) <= 3" class="flex items-center">
                          <Clock class="h-3 w-3 mr-1" />
                          Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-16">
              <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar class="h-6 w-6 text-gray-400" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No upcoming plans yet</h3>
              <p class="text-gray-600 mb-4 text-sm">Add visit dates to places in your collection to see them here</p>
              <button
                @click="activeTab = 'collection'"
                class="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Browse your collection →
              </button>
            </div>
          </div>
          
          <div v-else class="text-center py-16">
            <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Calendar class="h-6 w-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Plan your adventures</h3>
            <p class="text-gray-600 mb-4 text-sm">Sign in to create your upcoming places timeline</p>
            <button
              @click="showAuthModal = true"
              class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>

        <!-- Collection Section -->
        <div v-show="activeTab === 'collection'" class="space-y-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900 mb-2">Your collection</h1>
              <p class="text-gray-600 text-sm">{{ savedPlaces.length }} places saved • {{ savedPlaces.filter(p => p.socialMediaUrl).length }} with post references</p>
            </div>
          </div>

          <div v-if="isAuthenticated">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="place in savedPlaces"
                :key="place.id"
                @click="selectSavedPlace(place)"
                class="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-all duration-200 cursor-pointer group relative"
              >
                <!-- Post Reference Indicator -->
                <div v-if="place.socialMediaUrl" class="absolute top-3 right-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                
                <div class="flex items-start justify-between mb-3">
                  <div class="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div class="flex items-center space-x-2">
                    <div v-if="place.visitDate" class="text-xs text-gray-400">
                      {{ new Date(place.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                    </div>
                    <a v-if="place.socialMediaUrl" :href="place.socialMediaUrl" target="_blank" @click.stop class="text-blue-500 hover:text-blue-600">
                      <ExternalLink class="h-3 w-3" />
                    </a>
                  </div>
                </div>
                
                <h3 class="font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">{{ place.name }}</h3>
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ place.address }}</p>
                
                <div v-if="place.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                  <span
                    v-for="tag in place.tags.slice(0, 2)"
                    :key="tag"
                    class="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="place.tags.length > 2" class="text-xs text-gray-400">
                    +{{ place.tags.length - 2 }}
                  </span>
                </div>
                
                <div v-if="place.notes" class="text-xs text-gray-500 italic line-clamp-2 mb-2">
                  "{{ place.notes }}"
                </div>

                <!-- Reference Status -->
                <div class="text-xs text-gray-400">
                  {{ place.socialMediaUrl ? 'From social post' : 'No post reference' }}
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-16">
            <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Bookmark class="h-6 w-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Start your collection</h3>
            <p class="text-gray-600 mb-4 text-sm">Sign in to save places with their social media references</p>
            <button
              @click="showAuthModal = true"
              class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>

        <!-- Map Section -->
        <div v-show="activeTab === 'map'" class="space-y-8">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 mb-2">Explore</h1>
            <p class="text-gray-600 text-sm">All your saved places on the map</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden h-96 md:h-[600px]">
            <!-- Map Controls -->
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
              <div class="flex items-center space-x-4">
                <span class="text-sm font-medium text-gray-900">Map view</span>
                <div class="flex items-center space-x-1">
                  <button
                    @click="mapView = 'map'"
                    :class="mapView === 'map' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                    class="px-2 py-1 rounded text-xs font-medium transition-colors"
                  >
                    Map
                  </button>
                  <button
                    @click="mapView = 'satellite'"
                    :class="mapView === 'satellite' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                    class="px-2 py-1 rounded text-xs font-medium transition-colors"
                  >
                    Satellite
                  </button>
                </div>
              </div>
              <span class="text-xs text-gray-400">{{ savedPlaces.length }} places</span>
            </div>

            <!-- Full Map -->
            <div class="relative h-full bg-gray-100">
              <!-- Grid -->
              <div class="absolute inset-0 opacity-30">
                <div class="grid grid-cols-16 grid-rows-16 h-full w-full">
                  <div v-for="i in 256" :key="i" class="border-r border-b border-gray-200 last:border-r-0"></div>
                </div>
              </div>

              <!-- Multiple Pins -->
              <div class="absolute top-1/4 left-1/3">
                <div class="w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"></div>
              </div>
              <div class="absolute top-2/3 right-1/4">
                <div class="w-2 h-2 bg-green-500 rounded-full border border-white shadow-sm"></div>
              </div>
              <div class="absolute bottom-1/3 left-1/2">
                <div class="w-2 h-2 bg-purple-500 rounded-full border border-white shadow-sm"></div>
              </div>
              <div class="absolute top-1/2 right-1/3">
                <div class="w-2 h-2 bg-orange-500 rounded-full border border-white shadow-sm"></div>
              </div>

              <!-- Selected Location -->
              <div v-if="selectedPlace" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div class="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Section -->
        <div v-show="activeTab === 'profile'" class="space-y-8">
          <div v-if="isAuthenticated">
            <div class="flex items-center space-x-4 mb-8">
              <div class="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                <span class="text-white font-medium">{{ userInitials }}</span>
              </div>
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">{{ user.name }}</h1>
                <p class="text-gray-600 text-sm">{{ user.email }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <div class="text-2xl font-semibold text-gray-900 mb-1">{{ savedPlaces.length }}</div>
                <div class="text-sm text-gray-600">Places saved</div>
              </div>
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <div class="text-2xl font-semibold text-gray-900 mb-1">{{ savedPlaces.filter(p => p.socialMediaUrl).length }}</div>
                <div class="text-sm text-gray-600">With post references</div>
              </div>
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <div class="text-2xl font-semibold text-gray-900 mb-1">{{ upcomingPlaces.length }}</div>
                <div class="text-sm text-gray-600">Upcoming visits</div>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              <button class="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">Account settings</span>
                  <span class="text-gray-400">→</span>
                </div>
              </button>
              <button class="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">Export data</span>
                  <span class="text-gray-400">→</span>
                </div>
              </button>
              <button class="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">Privacy settings</span>
                  <span class="text-gray-400">→</span>
                </div>
              </button>
            </div>
          </div>
          
          <div v-else class="text-center py-16">
            <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <User class="h-6 w-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Create your profile</h3>
            <p class="text-gray-600 mb-4 text-sm">Sign in to access your personal dashboard</p>
            <button
              @click="showAuthModal = true"
              class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 md:hidden">
      <div class="grid grid-cols-5 h-16">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'"
          class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        >
          <component :is="tab.icon" class="h-4 w-4" />
          <span class="text-xs font-medium">{{ tab.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Auth Modal -->
    <div v-if="showAuthModal" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-gray-200">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ authMode === 'signin' ? 'Sign in' : 'Create account' }}
            </h3>
            <button @click="showAuthModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-4 w-4" />
            </button>
          </div>
          
          <form @submit.prevent="handleAuth" class="space-y-4">
            <div>
              <input
                v-model="authForm.email"
                type="email"
                required
                placeholder="Email"
                class="w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0 bg-transparent"
              />
            </div>
            <div>
              <input
                v-model="authForm.password"
                type="password"
                required
                placeholder="Password"
                class="w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0 bg-transparent"
              />
            </div>
            <button
              type="submit"
              class="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors mt-6"
            >
              {{ authMode === 'signin' ? 'Sign in' : 'Create account' }}
            </button>
          </form>
          
          <div class="mt-4 text-center">
            <button
              @click="authMode = authMode === 'signin' ? 'signup' : 'signin'"
              class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
  Star,
  X,
  User,
  Plus,
  Map,
  UserCircle,
  Calendar,
  Clock,
  Tag,
  Search,
  Info,
  Phone,
  ExternalLink,
  Lightbulb,
  Check,
  Link,
  AlertTriangle
} from 'lucide-vue-next'

// Navigation tabs
const tabs = [
  { id: 'add', label: 'Add', icon: Plus },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'collection', label: 'Collection', icon: Bookmark },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'profile', label: 'Profile', icon: UserCircle }
]

// State
const activeTab = ref('add')
const placeSearchQuery = ref('')
const socialMediaUrl = ref('')
const isSearching = ref(false)
const searchResults = ref([])
const selectedPlace = ref(null)
const isAuthenticated = ref(true)
const showAuthModal = ref(false)
const authMode = ref('signin')
const mapView = ref('map')
const tagInput = ref('')

// User data
const user = ref({ name: 'Alex Chen', email: 'alex@example.com' })
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

// Mock search results
const mockPlaces = [
  {
    id: 1,
    name: 'Blue Bottle Coffee',
    address: '66 Mint St, San Francisco, CA 94103',
    rating: 4.3,
    category: 'Coffee Shop',
    priceLevel: 2,
    hours: 'Open until 6 PM',
    phone: '(415) 495-3394'
  },
  {
    id: 2,
    name: 'Ritual Coffee Roasters',
    address: '1026 Valencia St, San Francisco, CA',
    rating: 4.5,
    category: 'Coffee Shop',
    priceLevel: 2,
    hours: 'Open until 8 PM'
  },
  {
    id: 3,
    name: 'Philz Coffee',
    address: '3101 24th St, San Francisco, CA',
    rating: 4.2,
    category: 'Coffee Shop',
    priceLevel: 2,
    hours: 'Open until 7 PM'
  },
  {
    id: 4,
    name: 'SFMOMA',
    address: '151 3rd St, San Francisco, CA',
    rating: 4.6,
    category: 'Art Museum',
    priceLevel: 3,
    hours: 'Open until 5 PM',
    phone: '(415) 357-4000'
  },
  {
    id: 5,
    name: 'Tartine Bakery',
    address: '600 Guerrero St, San Francisco, CA',
    rating: 4.4,
    category: 'Bakery',
    priceLevel: 2,
    hours: 'Open until 4 PM'
  }
]

// Saved places with social media references
const savedPlaces = ref([
  {
    id: 1,
    name: 'Ritual Coffee Roasters',
    address: '1026 Valencia St, San Francisco, CA',
    tags: ['coffee', 'work'],
    visitDate: '2024-01-20',
    notes: 'Perfect spot for morning work sessions. Great cortado.',
    socialMediaUrl: 'https://instagram.com/p/example1',
    rating: 4.5,
    category: 'Coffee Shop'
  },
  {
    id: 2,
    name: 'Dolores Park',
    address: 'Dolores St & 18th St, San Francisco, CA',
    tags: ['park', 'weekend', 'picnic'],
    visitDate: '2024-01-25',
    notes: 'Amazing city views, especially during sunset',
    socialMediaUrl: 'https://twitter.com/example2',
    rating: 4.7,
    category: 'Park'
  },
  {
    id: 3,
    name: 'Tartine Manufactory',
    address: '595 Alabama St, San Francisco, CA',
    tags: ['bakery', 'brunch', 'pastries'],
    visitDate: '2024-01-18',
    notes: 'The morning bun is incredible. Get there early.',
    rating: 4.4,
    category: 'Bakery'
  },
  {
    id: 4,
    name: 'SFMOMA',
    address: '151 3rd St, San Francisco, CA',
    tags: ['museum', 'art', 'culture'],
    visitDate: '2024-02-05',
    notes: 'Contemporary art collection is world-class',
    socialMediaUrl: 'https://instagram.com/p/example4',
    rating: 4.6,
    category: 'Art Museum'
  }
])

// Computed properties for upcoming places
const upcomingPlaces = computed(() => {
  const today = new Date()
  return savedPlaces.value
    .filter(place => place.visitDate && new Date(place.visitDate) >= today)
    .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))
})

const groupedUpcomingPlaces = computed(() => {
  const groups = []
  const today = new Date()
  const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const nextWeek = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const thisWeekPlaces = upcomingPlaces.value.filter(place => {
    const visitDate = new Date(place.visitDate)
    return visitDate <= thisWeek
  })

  const nextWeekPlaces = upcomingPlaces.value.filter(place => {
    const visitDate = new Date(place.visitDate)
    return visitDate > thisWeek && visitDate <= nextWeek
  })

  const thisMonthPlaces = upcomingPlaces.value.filter(place => {
    const visitDate = new Date(place.visitDate)
    return visitDate > nextWeek && visitDate <= thisMonth
  })

  const laterPlaces = upcomingPlaces.value.filter(place => {
    const visitDate = new Date(place.visitDate)
    return visitDate > thisMonth
  })

  if (thisWeekPlaces.length > 0) {
    groups.push({ period: 'This Week', places: thisWeekPlaces })
  }
  if (nextWeekPlaces.length > 0) {
    groups.push({ period: 'Next Week', places: nextWeekPlaces })
  }
  if (thisMonthPlaces.length > 0) {
    groups.push({ period: 'This Month', places: thisMonthPlaces })
  }
  if (laterPlaces.length > 0) {
    groups.push({ period: 'Later', places: laterPlaces })
  }

  return groups
})

// Methods
const onSocialUrlChange = () => {
  // Could potentially extract place hints from URL in the future
}

const searchPlaces = () => {
  if (!placeSearchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  
  // Simulate API search
  setTimeout(() => {
    searchResults.value = mockPlaces.filter(place =>
      place.name.toLowerCase().includes(placeSearchQuery.value.toLowerCase()) ||
      place.category.toLowerCase().includes(placeSearchQuery.value.toLowerCase())
    )
    isSearching.value = false
  }, 500)
}

const selectPlace = (place) => {
  selectedPlace.value = place
  searchResults.value = []
  placeSearchQuery.value = place.name
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

const savePlace = () => {
  if (!selectedPlace.value) return
  
  const newPlace = {
    id: Date.now(),
    ...selectedPlace.value,
    ...additionalDetails.value,
    socialMediaUrl: socialMediaUrl.value || null
  }
  
  savedPlaces.value.unshift(newPlace)
  
  // Reset form
  selectedPlace.value = null
  placeSearchQuery.value = ''
  socialMediaUrl.value = ''
  additionalDetails.value = {
    notes: '',
    tags: [],
    visitDate: ''
  }
  
  // Success feedback
  const button = event.target
  const originalText = button.textContent
  button.textContent = 'Saved!'
  setTimeout(() => {
    button.textContent = originalText
  }, 1000)
}

const selectSavedPlace = (place) => {
  selectedPlace.value = place
  socialMediaUrl.value = place.socialMediaUrl || ''
  placeSearchQuery.value = place.name
  activeTab.value = 'add'
}

// Helper functions
const getDaysUntil = (dateString) => {
  const today = new Date()
  const visitDate = new Date(dateString)
  const diffTime = visitDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const formatVisitDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getTimeIndicatorColor = (dateString) => {
  const days = getDaysUntil(dateString)
  if (days === 0) return 'bg-red-500'
  if (days <= 3) return 'bg-orange-500'
  if (days <= 7) return 'bg-yellow-500'
  return 'bg-blue-500'
}

const getWeatherHint = (dateString) => {
  const date = new Date(dateString)
  const month = date.getMonth()
  
  if (month >= 5 && month <= 8) return '☀️ Sunny'
  if (month >= 9 && month <= 11) return '🌤️ Mild'
  if (month >= 0 && month <= 2) return '🌧️ Rainy'
  return '🌫️ Foggy'
}

const handleAuth = () => {
  isAuthenticated.value = true
  showAuthModal.value = false
  authForm.value = { email: '', password: '' }
}

const signOut = () => {
  isAuthenticated.value = false
  activeTab.value = 'add'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>