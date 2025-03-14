// @ts-check

export const isFeatureDeployment = (context) =>
  context.eventName === 'pull_request' &&
  context.payload.pull_request &&
  context.payload?.pull_request?.base.ref &&
  context.payload.pull_request.labels &&
  Array.isArray(context.payload.pull_request.labels) &&
  context.payload.pull_request.labels.some(
    (label) => label.name === 'deploy-feature',
  )
