
const dockerTag = process.env.DOCKER_TAG
// TODO: better way to determine "current" branch?
const gitBranch = process.env.GIT_BRANCH ?? 'main'
const spinnakerWebhookToken = process.env.SPINNAKER_WEBHOOK_TOKEN
if (!dockerTag) throw Error("Need latest docker tag cached ⛄")
if (!spinnakerWebhookToken) throw Error("Need Spinnaker webhook token 😡")

/*
          |
          echo "Getting commit-sha for branch '$GIT_BRANCH'"
          GIT_LATEST_COMMIT=$( curl \
            -H "Authorization: bearer $GIT_API_TOKEN" \
            -X POST \
            -d '{ "query": "$GIT_LATEST_COMMIT_GQL"}' \
            | jq -r '.data.repository.ref.target.oid' \
          )
          echo "Found commit-sha for $GIT_BRANCH: $GIT_LATEST_COMMIT"
          echo "Sending webhook with branch: '$GIT_BRANCH'"
          curl $SPINNAKER_URL/webhooks/webhook/islandis -H "content-type: application/json" --data-binary @- <<BODY
          {
            "token": "$SPINNAKER_WEBHOOK_TOKEN",
            "branch": "$GIT_BRANCH",
            "parameters": {
              "docker_tag": "$DOCKER_TAG",
              "feature_name": "system-e2e-nightly",
            }
          }
          BODY
  */
