docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker volume rm $(docker volume ls -q)


yarn nx run application-templates-party-application:dev/init
yarn nx run application-templates-party-application:dev/init

yarn nx run services-temporary-voter-registry-api:seed
yarn nx run services-party-letter-registry-api:seed
yarn nx run application-system-api:seed
yarn nx run services-endorsements-api:seed

yarn nx run application-templates-party-application:dev
