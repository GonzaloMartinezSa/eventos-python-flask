# Last Super Frontend



## Getting started

La idea es que quede esto (con esos nombres para las carpetas):

/last-supper\
---/back                ---> correspondiente al repo de backend\
---/front               ---> correspondiente al repo de frontend (este)\
---docker-compose.yml   ---> copiado de alguna de las dos carpetas, front o back

y tirar 'docker compose build' y despues 'docker compose up'

```bash
# Create the project's directory
$ mkdir last-supper

# Clone the backend
$ git clone https://gitlab.com/tacs-2023c1-g4/last-supper.git

# Clone the frontend (this project)
$ git clone https://gitlab.com/tacs-2023c1-g4/last-super-frontend.git

# Rename
$ mv last-supper back
$ mv last-supper-frontend front

# Move to project's directory
$ mv back /last-supper/
$ mv front /last-supper/

# Access the project root
$ cd last-supper

# Setup the enviroments
$ nano /back/.env

# Extract the docker compose
$ mv /back/docker-compose.yml ./

# Build the containers (It can take a some seconds)
$ docker compose build 

# Run the compose
$ docker compose up 

# The API will initialize in <http://localhost:5000>
# The Web will initialize in <http://localhost:3000>

```
