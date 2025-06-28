package services

import "github.com/qlfzn/roamap/internal/data"

type PostService struct {}

func (p *PostService) GetPosts() []data.Post {
	return data.Posts
}