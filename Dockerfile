FROM node:21-slim as base

# Adding in the required files
ADD . /service
WORKDIR /service
RUN ["npm", "install"]
RUN ["npm", "run", "build"]

# Changing UID/GID to avoid "Container ID Cannot Be Mapped to Host ID Error"
# https://community.atlassian.com/t5/Bitbucket-articles/Changes-to-make-your-containers-more-secure-on-Bitbucket/ba-p/998464#M89
RUN chown -R root:root /service

FROM docker.atl-paas.net/sox/micros-node-18:1.0.11

COPY --from=base /service /opt/service

ENV PORT 8080
EXPOSE 8080
