package handlers

import (
	"net/http"

	"github.com/qlfzn/roamap/internal/utils"
)

type NewPlacePayload struct {
	Name string `json:"name"`
}

type Place struct {
	Name string
	Lat string
	Long string
	Address string
	Details PlaceDetail
}

type PlaceDetail struct {
	Ratings string
	OpenHours string
}

func (p *Place) NewPlaceHandler(w http.ResponseWriter, r *http.Request) {
	var NewPlace NewPlacePayload

	err := utils.ReadJSON(w, r, &NewPlace)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// check if place exist in map -> call service
	
}
