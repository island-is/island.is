.PHONY: backend api web
CWD=../../
MAKEFLAGS += -j
ARGS=$(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(ARGS):;@:)

docker:
	docker-compose -f ./backend/docker-compose.base.yml -f ./backend/docker-compose.dev.yml up

backend:
	./${CWD}scripts/_wait-for.sh localhost:5432  # postgresql
	./${CWD}scripts/_wait-for.sh localhost:7000  # redis-cluster
	yarn --cwd ${CWD} nx serve air-discount-scheme-backend

services: docker backend

api:
	yarn --cwd ${CWD} nx serve air-discount-scheme-api

web:
	yarn --cwd ${CWD} nx serve air-discount-scheme-web
