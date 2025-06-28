package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/qlfzn/roamap/internal/handlers"
)

type application struct {
	config Config
	postHandler *handlers.Post
	placeHandler *handlers.Place
}

type Config struct {
	addr string
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Route("/v1", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("ok from the server"))
		})
		r.Post("/posts", app.postHandler.SavePostHandler)
		r.Get("/posts", app.postHandler.GetPostHandler)

		r.Get("/places/{id}", app.placeHandler.GetPlaceById)
	})

	return r
}

func (app *application) run(mux http.Handler) error {
	// init server instance
	srv := &http.Server{
		Addr: app.config.addr,
		Handler: mux,
	}

	log.Println("server has started at http://localhost:8080/v1")

	err := srv.ListenAndServe()
	if err != nil {
		return err
	}

	return nil
} 