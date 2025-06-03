rm -r ../charts/features/deployments/
IMAGES="api,application-system-api,application-system-api-worker,unicorn-app"
FEATURE_NAME=feature_test
DOCKER_TAG=tag_my_bitch_up
DOCKER_REGISTRY=great_registy

./scripts/generate-feature-values.sh "$FEATURE_NAME" "$DOCKER_TAG" "$IMAGES" "$DOCKER_REGISTRY"
