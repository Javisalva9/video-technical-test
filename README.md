# Video Technical Test

This project explores video streaming from a Content Delivery Network (CDN) within a load-balanced environment. It utilizes Docker Compose to set up a React frontend and a Node.js backend, showcasing how to efficiently serve video content.

## Getting started

You can start the project by running the command below in your terminal at the root of the project. This will start 4 containers, the client side React application, the server side Express application, a mongodb instance and a script to seed the database with some dummy data.

```
docker-compose run --rm dependencies && docker compose up client server mongo-seed
```