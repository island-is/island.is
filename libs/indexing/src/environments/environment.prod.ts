import { Environment } from './environment'

export const environment: Environment = {
  contentful: {
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    host: process.env.CONTENTFUL_HOST,
  },
  domains: ['cms'],
  indexableTypes: ['article']
}
