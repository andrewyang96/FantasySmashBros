#
# Go Dockerfile
#
# https://github.com/dockerfile/go
#

# Pull base image.
FROM ubuntu

MAINTAINER Andrew Yang

RUN apt-get -y install curl
RUN apt-get -y install git

# Install Go
RUN \
  mkdir -p /goroot && \
  curl https://storage.googleapis.com/golang/go1.5.2.linux-amd64.tar.gz | tar xvzf - -C /goroot --strip-components=1

# Set environment variables.
ENV GOROOT /goroot
ENV GOPATH /gopath
ENV PATH $GOROOT/bin:$GOPATH/bin:$PATH

# Define working directory.
ADD . /gopath/fantasy-smash-bros-jwt
WORKDIR /gopath/fantasy-smash-bros-jwt

# Install necessary Go packages
RUN go get github.com/dgrijalva/jwt-go

EXPOSE 5987

# Build and run
CMD ["go", "run", "main.go"]
