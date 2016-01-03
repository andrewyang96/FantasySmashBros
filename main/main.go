package main

import (
	//"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", handleIndex)

	fmt.Println("Listening on port 8000")
	http.ListenAndServe(":8000", nil)
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Fantasy Smash Bros Main API"))
	w.WriteHeader(200)
}


