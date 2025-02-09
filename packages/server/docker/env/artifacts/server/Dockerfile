FROM node:lts-alpine as base

WORKDIR /srv/video-technical-test-server

COPY package.json yarn.lock ./

FROM base as development

RUN apk add -U --no-cache --quiet \
    # npm
    git \
    # node-gyp
    # https://github.com/nodejs/node-gyp/tree/v5.0.4#on-unix
    g++ \
    make \
    python3

# # Hide harmless warnings from node-gyp builds.
ENV CXXFLAGS='-Wno-deprecated-declarations'

# # Silence annoying '(node:1) Warning: .then() only accepts functions but was passed: [object Object]'
ENV BLUEBIRD_DEBUG='0'

# # Silence annoying support messages during install
ENV SUPPRESS_SUPPORT='true'

# Install development dependencies.
ENV NODE_ENV='development'

# No need to bake credentials into the image
RUN yarn install --loglevel warn

CMD ["npm", "start"]