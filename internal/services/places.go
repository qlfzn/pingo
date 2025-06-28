package services

import (
	"context"
	"log"

	"googlemaps.github.io/maps"
)
type PlaceService struct {
	client *maps.Client
}

type PlaceDetails struct {
	Name string
	Location maps.LatLng
}

func NewPlaceService(apiKey string) (*PlaceService, error) {
	c, err := maps.NewClient(maps.WithAPIKey(apiKey))
	if err != nil {
		log.Printf("error creating client: %s", err)
		return nil, err
	}

	return &PlaceService{client: c}, nil
}

func (ps *PlaceService) GetPlaceDetails(id string) (*PlaceDetails, error) {
	r := &maps.PlaceDetailsRequest{
		PlaceID: id,
	}

	ctx := context.Background()
	details, err := ps.client.PlaceDetails(ctx, r)
	if err != nil {
		log.Printf("error fetching place: %s", err)
		return nil, err
	}

	return &PlaceDetails{
		Name: details.Name,
		Location: details.Geometry.Location,
	}, nil
}