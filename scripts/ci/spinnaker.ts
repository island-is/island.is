
const dockerTag = process.env.DOCKER_TAG || process.env.LAST_GOOD_BUILD_DOCKER_TAG
const gitBranch = (process.env.GIT_BRANCH || process.env.BASE) ?? 'main'
const spinnakerWebhookToken = process.env.SPINNAKER_WEBHOOK_TOKEN
const spinnakerUrl = `${process.env.SPINNAKER_URL}/webhooks/webhook/islandis`
if (!dockerTag) throw Error("Need latest docker tag cached ⛄")
if (!spinnakerWebhookToken) throw Error("Need Spinnaker webhook token 😡")

const trigger = new Request(
  spinnakerUrl,
  {
    method: 'POST',
    body:
      JSON.stringify({
        token: spinnakerWebhookToken,
        branch: gitBranch,
        parameters: {
          docker_tag: dockerTag,
          feature_name: "system-e2e-nightly",
        },
      })
  })
fetch(trigger)
