FROM node:slim
MAINTAINER rmassaioli@gmail.com

# Export to PORT 8080 for Micros
ENV PORT 8080
EXPOSE 8080

# Adding in the required files
ADD . /service
WORKDIR /service
RUN ["npm", "install"]
RUN ["npm", "run", "build-prod"]

CMD ["node", "main.js"]
