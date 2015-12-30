FROM    ubuntu

# File Author / Maintainer
MAINTAINER Andrew Yang

# Install Python Setuptools
RUN apt-get install -y python-setuptools

# Install pip
RUN easy_install pip

# Add and install Python modules
ADD requirements.txt /src/requirements.txt
RUN cd /src; pip install -r requirements.txt

# Bundle app source
ADD ./app /src

# Expose port
EXPOSE  5000

# Run
CMD ["python", "/src/app.py"]
