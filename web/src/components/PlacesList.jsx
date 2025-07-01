import { PlaceCard } from "./PlaceCard"

export function PlacesList({ places, onEdit, onDelete }) {
  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16">
        <div className="text-5xl mb-4 opacity-40">✈️</div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No places saved yet</h3>
        <p className="text-gray-500">Start building your travel wishlist!</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}
