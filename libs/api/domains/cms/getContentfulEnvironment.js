const contentfulManagement = require('contentful-management')

const getEnv = (key, default_ = null) => {
  if (!process.env[key] && !default_) {
    console.error(`Required environment variable '${key}' is not set.`)
    process.exit(-1)
  }
  return process.env[key] || default_
}

module.exports = function() {
  const contentfulClient = contentfulManagement.createClient({
    accessToken: getEnv('CONTENTFUL_MANAGEMENT_TOKEN'),
  })

  return contentfulClient
    .getSpace(getEnv('CONTENTFUL_SPACE_ID', '8k0h54kbe6bj'))
    .then((space) => {
      return space.getEnvironment(getEnv('CONTENTFUL_ENVIRONMENT', 'master'))
    })
}
