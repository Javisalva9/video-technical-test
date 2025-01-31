# Kodify Technical Test

## Getting started

Clone the repo onto your development environment and create a new branch named `your-name`. Once finished push the branch back to origin and open a pull request against `main`.
Make sure you have [docker](https://docs.docker.com/get-docker/) and [docker compose](https://docs.docker.com/compose/install/) installed.

You can start the project by running the command below in your terminal at the root of the project. This will start 4 containers, the client side React application, the server side Express application, a mongodb instance and a script to seed the database with some dummy data.

```
docker-compose run --rm dependencies && docker compose up client server mongo-seed
```

## The codebase

In the [packages](/packages) you'll see a [React App](/packages/client) that contains a video player component and the parent App component. On render the App calls our [server](/packages/server) with the videoId of `12345` returning a Video with it's sources. We then send our Video to the token endpoint to sign it's sources. We update the players props, which in turn causes the player to load the video, enabling it to be played.

### Tasks

We would like you to complete the following tasks:

*Make sure you split your changes on separate commits for easier reviewing. Please submit the PR to the recruiter via email.*

### Task 1

Troubleshoot and fix the `/video/12345` request in the App component.

### Task 2

Create the endpoint for the url signing. The hash should be generated using the instructions below and appended to each source url.

For the cdn to accept the request, the url needs to contain a query param called `token` that is equal to a md5 hex encoded hash of the uri with a `secret` query param set to the relative key in the table below.

For example `http://www.cdn.com/big_buck_bunny.mp4` would require a hash encoding of `/big_buck_bunny.mp4?secret=U5e0IskwtIfA` resulting in the following call to the cdn: `http://www.cdn.com/big_buck_bunny.mp4?token=666906502bbc3550b95d561fa14af3ae`

| CDN Name | CDN Address | KEY |
| -------- | ----------- | --- |
| AWS CDN 1 | https://d2usdis6r1u782.cloudfront.net | U5e0IskwtIfA |

### Task 3

Update the create signed url endpoint to load balance each request equally across the following cdn's

| CDN Name | CDN Address | KEY |
| -------- | ----------- | --- |
| AWS CDN 1 | https://d2usdis6r1u782.cloudfront.net | U5e0IskwtIfA |
| AWS CDN 2 | https://d2oukvvww2uoq.cloudfront.net | 9Weh3dv6QgDN |
| AWS CDN 3 | https://dbke9ww44or29.cloudfront.net | 7x1vGkO75i1Y |

### Task 4

Refactor the `/video/:videoId` controller on the server to decouple the video viewed tracking.

### Task 5

Write tests for the existing code that you modify, and the code that you add.

## Bonus points

Can you improve this technical test? Or have you spotted a typo? Open an issue or submit a pull request.

## Assessment Points

The assessment of your technical performance for each task will be based on the quality of your code.
We will consider the following factors among others to evaluate your mastery of the concepts in software development: 

 - Usage of best practices and standards
 - Easy reading and reviewing
 - flow control
 - testing quality
 - error handling
 - status codes

## Thanks

Thank you for taking the time to do this test, we look forward to reviewing it.

*If you have any question or you're having trouble getting started, please get in touch with the recruiter*

## Good Luck!
