#
# Go Dockerfile
#
# https://github.com/dockerfile/go
#

# Pull base image.
FROM ubuntu

MAINTAINER Andrew Yang

RUN apt-get -y install curl

# Install Go
RUN \
  mkdir -p /goroot && \
  curl https://storage.googleapis.com/golang/go1.5.2.linux-amd64.tar.gz | tar xvzf - -C /goroot --strip-components=1

# Set environment variables.
ENV GOROOT /goroot
ENV GOPATH /gopath
ENV PATH $GOROOT/bin:$GOPATH/bin:$PATH

# Define working directory.
WORKDIR /gopath
ADD . /gopath/fantasy-smash-bros-api

EXPOSE 8000

# Define default command.
CMD ["go", "run", "/gopath/fantasy-smash-bros-api/main.go"]
