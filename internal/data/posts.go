package data

type Post struct {
	ID          string `json:"id"`
	URL         string `json:"url"`
	Title       string `json:"title"`
	Description string `json:"description"`
	PlaceID     string `json:"placeId"`
	DateToGo    string `json:"dateToGo"`
}

var Posts = []Post{
	{
		ID:          "1",
		URL:         "https://example.com/post/1",
		Title:       "Cafe ABC",
		Description: "Nice vibes",
		PlaceID:     "ChIJN1t_tDeuEmsRUsoyG83frY4",
		DateToGo:    "2025-07-01",
	},
	{
		ID:          "2",
		URL:         "https://example.com/post/2",
		Title:       "Resort XYZ",
		Description: "Looks peaceful",
		PlaceID:     "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
		DateToGo:    "2025-08-15",
	},
}
