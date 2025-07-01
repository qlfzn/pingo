package services

import (
	"github.com/qlfzn/pingo/internal/data"
	"github.com/qlfzn/pingo/internal/store"
)

type PostService struct{}

func (p *PostService) GetPosts() []data.Post {
	return data.Posts
}

func (p *PostService) SavePost(postData *data.Post) error {
	err := store.SavePosts(postData)
	if err != nil {
		return err
	}

	return nil
}