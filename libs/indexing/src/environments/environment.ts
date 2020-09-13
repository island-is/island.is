export interface Environment {
  contentful: {
    space: string
    accessToken: string
    environment: string
    host: string
  }
  domains: string[]
  indexableTypes: string[]
}

export const environment: Environment = {
  contentful: {
    space: process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'test',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
  },
  domains: ['cms'],
  indexableTypes: ['article']
}
