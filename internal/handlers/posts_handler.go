package handlers

import (
	"net/http"

	"github.com/qlfzn/pingo/internal/data"
	"github.com/qlfzn/pingo/internal/services"
	"github.com/qlfzn/pingo/internal/utils"
)

type Post struct {
	// injects services dependencies
	Service *services.PostService
}

func (p *Post) CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	var post data.Post

	err := utils.ReadJSON(w, r, &post)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = p.Service.SavePost(&post)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message": "post saved successfully",
		"url":     post.URL,
	})
}

func (p *Post) GetPostHandler(w http.ResponseWriter, r *http.Request) {
	posts := p.Service.GetPosts()
	utils.WriteJSON(w, http.StatusCreated, posts)
}
