.PHONY: application api web queue-listener
CWD=../../
MAKEFLAGS += -j
ARGS=$(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(ARGS):;@:)

db:
	docker-compose up -d db ${ARGS}

redis:
	docker-compose up -d redis-cluster ${ARGS}

localstack:
	docker-compose up -d localstack ${ARGS}

docker:
	docker-compose up

application:
	./${CWD}scripts/_wait-for.sh localhost:5432  # postgresql
	./${CWD}scripts/_wait-for.sh -t 60 localhost:7777  # queue-listener
	yarn --cwd ${CWD} nx serve gjafakort-application

queue-listener:
	./${CWD}scripts/_wait-for.sh localhost:4575  # AWS SNS
	./${CWD}scripts/_wait-for.sh localhost:4576  # AWS SQS
	sleep 20  # localstack takes for ever to start
	yarn --cwd ${CWD} nx serve gjafakort-queue-listener

services: docker application queue-listener

api:
	yarn --cwd ${CWD} nx serve gjafakort-api

web:
	yarn --cwd ${CWD} nx serve gjafakort-web
