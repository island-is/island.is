// @ts-check
import { fileURLToPath } from 'url'

export const isMainModule = (importMetaUrl) =>
  process.argv[1] === fileURLToPath(importMetaUrl)

export const isFeatureDeployment = (context) =>
  context.eventName === 'pull_request' &&
  context.payload.pull_request &&
  context.payload?.pull_request?.base.ref &&
  context.payload.pull_request.labels &&
  Array.isArray(context.payload.pull_request.labels) &&
  context.payload.pull_request.labels.some(
    (label) => label.name === 'deploy-feature',
  )

export const findNestedObjectByKey = (obj, key) => {
  let foundObj
  JSON.stringify(obj, (_, nestedValue) => {
    if (nestedValue && nestedValue[key]) {
      foundObj = nestedValue
    }
    return nestedValue
  })
  return foundObj
}
