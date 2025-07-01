package handlers

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/qlfzn/pingo/internal/services"
	"github.com/qlfzn/pingo/internal/utils"
)

type NewPlacePayload struct {
	PlaceID string `json:"place_id"`
}

type Place struct {
	// define dependencies
	Service *services.PlaceService
}

func (p *Place) GetPlaceById(w http.ResponseWriter, r *http.Request) {
	var newPlace NewPlacePayload
	id := chi.URLParam(r, "id")
	newPlace.PlaceID = id

	location, err := p.Service.GetPlaceDetails(newPlace.PlaceID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"msg":      "fetched location details",
		"id":       newPlace.PlaceID,
		"name":     location.Name,
		"geometry": location.Location.String(),
	})
}