package store

import "github.com/qlfzn/pingo/internal/data"

var posts = make(map[string]data.Post)

func SavePosts(p *data.Post) error {
	posts[p.ID] = *p

	return nil
}

func GetAllPosts(p *data.Post) []data.Post{
	var list []data.Post
	for _, v := range posts {
		list = append(list, v)
	}

	return list
}