package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi"
)

type application struct {
	config Config
}

type Config struct {
	addr string
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Route("/v1", func(r chi.Router) {
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("ok from the server"))
		})
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