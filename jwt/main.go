package main

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"io/ioutil"
	"net/http"
	"time"
)

type Config struct {
	JwtSecret string
	JwtExpireInMinutes float64
}

var config Config

func main() {
	// Read JWT configs
	configBlob, err := ioutil.ReadFile("config.json")
	if err != nil {
		panic("Cannot read config.json")
	}
	err = json.Unmarshal(configBlob, &config)
	if err != nil {
		panic("Cannot unmarshal config.json")
	}

	http.HandleFunc("/", handleIndex)
	http.HandleFunc("/issuetoken", handleIssueToken)
	http.HandleFunc("/verifytoken", handleVerifyToken)

	fmt.Println("Listening on port 5987")
	http.ListenAndServe(":5987", nil)
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Fantasy Smash Bros Internal JWT API"))
	w.WriteHeader(200)
}

func handleIssueToken(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	if username == "" {
		http.Error(w, "No username provided", 400)
		return
	}

	// Set token claims
	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims["username"] = username
	token.Claims["exp"] = time.Now().Add(time.Minute * time.Duration(config.JwtExpireInMinutes)).Unix()

	// Sign token
	tokenString, err := token.SignedString([]byte(config.JwtSecret))
	if err != nil {
		http.Error(w, "Couldn't sign token", 500)
		return
	}

	w.Write([]byte(tokenString))
	w.WriteHeader(200)
}

func handleVerifyToken(w http.ResponseWriter, r *http.Request) {
	tokenString := r.FormValue("token")
	if tokenString == "" {
		http.Error(w, "No token provided", 400)
		return
	}

	// Decode token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Verify signing method
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.JwtSecret), nil
	})

	if err != nil {
		fmt.Println(err)
		http.Error(w, "Couldn't parse provided token", 400)
	} else if token.Valid {
		w.WriteHeader(200)
	} else {
		http.Error(w, "Invalid token", 401)
	}
}
