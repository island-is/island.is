// TODO: Allow to change so we can run on dev (and feature deployments?)
// const TEST_DOMAIN = 'staging01.devland.is'
const TEST_DOMAIN = 'dev01.devland.is'

export const getPageUrl = (prefix: string, path: string) =>
  `https://${prefix}.${TEST_DOMAIN}${path}`
