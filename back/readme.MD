<h1 align="center">LAST SUPPER</h1>


<!-- Status -->

<h4 align="center"> 
	🚧  LAST SUPPER🚀 Is a university project 🚧<br><br>
  TACS 2023 1C
</h4>

<hr>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
</p>

<br>

## :dart: About ##

System to organize meetings of many people. 

[Guidelines](https://docs.google.com/document/u/0/d/e/2PACX-1vSOjnpw4O-XEjpcK3Yei_FUmBoAQNMwre7mpq81ub2Xqbzy_TRupGIqjIURd4RijgiE7s0fAOlR1DR2/pub)

## :sparkles: Features ##
:heavy_check_mark: MongoDB (NoSQL) database integration;\
:heavy_check_mark: Integrated with GITLAB;\
:heavy_check_mark: Pytest Integration;\

## :rocket: Technologies ##

The following tools were used in this project:

- [Flask](https://flask.palletsprojects.com)
- [MongoDB](https://www.mongodb.com)
- [Python](https://www.python.org/)
- [Docker](https://www.docker.com/)

## :white_check_mark: Requirements ##

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Docker](https://www.docker.com/) installed.

## :checkered_flag: Starting ##

```bash
# Clone this project
$ git clone https://gitlab.com/tacs-2023c1-g4/last-supper.git

# Access the project root
$ cd last-supper

# Setup the enviroments
$ nano .env

# Build the containers (It can take a some seconds)
$ docker compose build 

# Run the compose
$ docker compose up 

# The API will initialize in the <http://localhost:5000>

```
## :white_check_mark: How to use it? ##

You have deployed the system, now you can navigate and start using it. At <http://localhost:5000>, there will be the following **endpoints**:


- POST /signup

```json
{
  "username": "Juan",
  "password": "bola2345"
}
```

- POST /login
```json
{
  "username": "Juan",
  "password": "bola2345"
}
```

- GET /logout

- GET /events

- GET /events/:id

- POST /events
```json
{
  "name": "evento_default"
}
```

- POST /events/:id/options
```json
{
  "datetime": "18/04/2023 11:00:20"
}
```

- POST /events/:id_event/options/:id_option/votes
```
no body
```

- POST /events/:id_event/close
```
no body
```
- GET /events-info


## :memo: License ##

This is a university project. The code can be used :).


&#xa0;

<a href="#top">Back to top</a>
