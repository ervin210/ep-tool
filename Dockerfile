FROM node:14-slim as base

# Adding in the required files
ADD . /service
WORKDIR /service
RUN ["npm", "install"]
RUN ["npm", "run", "build"]

# Changing UID/GID to avoid "Container ID Cannot Be Mapped to Host ID Error"
# https://community.atlassian.com/t5/Bitbucket-articles/Changes-to-make-your-containers-more-secure-on-Bitbucket/ba-p/998464#M89
RUN chown -R root:root /service

FROM gcr.io/distroless/nodejs14-debian11

COPY --from=base /service /service

ENV PORT 8080
EXPOSE 8080

WORKDIR /service
CMD ["main.js"]
