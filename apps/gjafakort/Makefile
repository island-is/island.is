.PHONY: application api web queue-listener
CWD=../../
MAKEFLAGS += -j
ARGS=$(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(ARGS):;@:)

db:
	docker-compose -f application/docker-compose.base.yml -f application/docker-compose.dev.yml up -d db_gjafakort_application ${ARGS}

redis:
	docker-compose -f application/docker-compose.base.yml -f application/docker-compose.dev.yml up -d redis_cluster ${ARGS}

localstack:
	docker-compose -f application/docker-compose.base.yml -f application/docker-compose.dev.yml up -d localstack ${ARGS}

docker:
	docker-compose -f application/docker-compose.base.yml -f application/docker-compose.dev.yml up

application:
	./${CWD}scripts/_wait-for.sh localhost:5432  # postgresql
	./${CWD}scripts/_wait-for.sh -t 60 localhost:7777  # queue-listener
	yarn --cwd ${CWD} start gjafakort-application

queue-listener:
	./${CWD}scripts/_wait-for.sh localhost:4575  # AWS SNS
	./${CWD}scripts/_wait-for.sh localhost:4576  # AWS SQS
	sleep 20  # localstack takes for ever to start
	yarn --cwd ${CWD} start gjafakort-queue-listener

services: docker application queue-listener

api:
	yarn --cwd ${CWD} start gjafakort-api

web:
	yarn --cwd ${CWD} start gjafakort-web
