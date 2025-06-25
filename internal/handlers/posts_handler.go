package handlers

import (
	"net/http"

	"github.com/qlfzn/roamap/internal/utils"
)

type NewPostPayload struct {
	Url string `json:"url"` 
	Title string `json:"title"`
}

type Post struct {
	// injects services dependencies
}

func (p *Post) SavePostHandler(w http.ResponseWriter, r *http.Request) {
	var payload NewPostPayload

	err := utils.ReadJSON(w, r, payload)
	if err != nil {
		http.Error(w, "error reading data: ", http.StatusBadRequest)
	}

	// TODO: validation
	// TODO: pass to service layer
	
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message" : "post saved successfully",
		"url" : payload.Url,
	})
}