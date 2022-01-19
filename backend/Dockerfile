FROM node:12.22.7-alpine3.12
WORKDIR /app
COPY . .
RUN npm install
ENV KEYCLOAK_BASE_URL "http://oer-cycle.elearn.rwth-aachen.de/keycloak"
ENV MONGO_DB_BASE_URL "mongodb://mongo_db:27017/"
CMD ["npm", "start"]