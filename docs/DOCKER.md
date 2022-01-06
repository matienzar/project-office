# Docker config
The configuration of the different docker images, to use docker-compose, is done through the file: **docker-compose.yml**

To start docker in mode compose, you must launch this command
```shell script
$ docker-compose up
```

## Mongodb
Update to latest mongodb
```shell script
$ docker pull mongo:latest
```
Access to docker console
```shell script
$ docker exec -it docker-image-name bash
```
View logs
```shell script
$ docker logs docker-image-name
```