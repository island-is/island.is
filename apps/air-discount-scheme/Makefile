.PHONY: backend api web
CWD=../../
MAKEFLAGS += -j
ARGS=$(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(ARGS):;@:)

docker:
	docker compose -f ./backend/docker-compose.yml up

backend:
	./${CWD}scripts/_wait-for.sh localhost:5432  # postgresql
	./${CWD}scripts/_wait-for.sh localhost:7010  # redis-cluster
	yarn --cwd ${CWD} start air-discount-scheme-backend

services: docker backend

api:
	yarn --cwd ${CWD} start air-discount-scheme-api

web:
	yarn --cwd ${CWD} start air-discount-scheme-web
