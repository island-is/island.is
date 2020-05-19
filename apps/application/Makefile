ARGS=$(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(ARGS):;@:)

db:
	docker-compose up ${ARGS} db

services: db
