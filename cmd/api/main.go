package main

import (
	"log"
	"os"

    "github.com/joho/godotenv"
	"github.com/qlfzn/roamap/internal/handlers"
	"github.com/qlfzn/roamap/internal/services"
)

func main() {  
	// load priv key in memory
	err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found, using system environment variables")
    }

	cfg := Config{
		addr: ":8080",
	}

	postService := &services.PostService{}
	postHandler := &handlers.Post{ Service: postService}

	placeService, err := services.NewPlaceService(os.Getenv("GOOGLE_API_KEY"))
	if err != nil {
		log.Fatal("failed to create place service: ", err)
	}
	placeHandler := &handlers.Place{ Service: placeService}

	app := &application{
		config: cfg,
		postHandler: postHandler,
		placeHandler: placeHandler,
	}

	mux := app.mount()

	log.Fatal(app.run(mux))
}