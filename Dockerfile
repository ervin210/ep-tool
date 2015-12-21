FROM node:slim
MAINTAINER rmassaioli@gmail.com

# Export to PORT 8080 for Micros
ENV PORT 8080
EXPOSE 8080

# Adding in the required files
ADD . /service
WORKDIR /service
RUN ["npm", "install"]
RUN ["npm", "install", "-g", "grunt-cli"]
RUN ["grunt", "requirejs:prod", "less:prod"]

CMD ["node", "main.js"]
