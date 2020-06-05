.PHONY: application api web
MAKEFLAGS += -j
ARGS=$(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(ARGS):;@:)

db:
	docker-compose up -d db ${ARGS}

redis:
	docker-compose up -d redis ${ARGS}

localstack:
	docker-compose up -d localstack ${ARGS}

docker:
	docker-compose up

application:
	yarn --cwd ../../ nx serve gjafakort-application

queue-listener:
	yarn --cwd ../../ nx serve gjafakort-queue-listener

services: docker application queue-listener

api:
	yarn --cwd ../../ nx serve gjafakort-api

web:
	yarn --cwd ../../ nx serve gjafakort-web
