FROM node:slim as base

# Adding in the required files
ADD . /service
WORKDIR /service
RUN ["npm", "install"]
RUN ["npm", "run", "build"]

FROM docker.atl-paas.net/golden-images/node:14-alpine

COPY --from=base /service /service

ENV PORT 8080
EXPOSE 8080

WORKDIR /service
CMD ["main.js"]
