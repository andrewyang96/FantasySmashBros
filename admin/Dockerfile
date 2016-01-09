FROM    pataquets/phpmongodb

# File Author / Maintainer
MAINTAINER Andrew Yang

ENV DATABASEADDR database
WORKDIR /var/www/html

RUN apt-get -y update
RUN apt-get -y install git
RUN git clone https://github.com/andrewyang96/phpmongodb
COPY config.php phpmongodb/config.php

EXPOSE 80
