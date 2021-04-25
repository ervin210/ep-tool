FROM node:slim as base

# Adding in the required files
ADD . /service
WORKDIR /service
RUN ["npm", "install"]
RUN ["npm", "run", "build"]

FROM gcr.io/distroless/nodejs:14

COPY --from=base /service /service

ENV PORT 8080
EXPOSE 8080

CMD ["/service/main.js"]
