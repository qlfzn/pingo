package handlers

import (
	"net/http"

	"github.com/qlfzn/roamap/internal/services"
	"github.com/qlfzn/roamap/internal/utils"
)

type NewPostPayload struct {
	Url string `json:"url"` 
	Title string `json:"title"`
}

type Post struct {
	// injects services dependencies
	Service *services.PostService
}

func (p *Post) SavePostHandler(w http.ResponseWriter, r *http.Request) {
	var payload NewPostPayload

	err := utils.ReadJSON(w, r, &payload)
	if err != nil {
		http.Error(w, err.Error() , http.StatusBadRequest)
		return
	}

	// TODO: validation
	// TODO: pass to service layer
	
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message" : "post saved successfully",
		"url" : payload.Url,
	})
}

func (p *Post) GetPostHandler(w http.ResponseWriter, r *http.Request) {
	posts := p.Service.GetPosts()
	utils.WriteJSON(w, http.StatusCreated, posts)
}