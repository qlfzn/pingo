package data

type Post struct {
	ID          int
	URL         string
	Name        string
	Description string
	PlaceID     string
	DateToGo    string
}

var Posts = []Post{
	{
		ID:          1,
		URL:         "https://example.com/post/1",
		Name:        "Cafe ABC",
		Description: "Nice vibes",
		PlaceID:     "ChIJN1t_tDeuEmsRUsoyG83frY4",
		DateToGo:    "2025-07-01",
	},
	{
		ID:          2,
		URL:         "https://example.com/post/2",
		Name:        "Resort XYZ",
		Description: "Looks peaceful",
		PlaceID:     "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
		DateToGo:    "2025-08-15",
	},
}
