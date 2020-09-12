import { Environment } from './environment'

export const environment: Environment = {
  production: true,
  contentful: {
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    host: process.env.CONTENTFUL_HOST,
  },
  domains: ['cms'],
  indexableTypes: ['article'],
  migrate: {
    elasticNode: process.env.ELASTIC_NODE,
    s3Bucket: process.env.S3_BUCKET,
    awsRegion: process.env.AWS_REGION,
    esDomain: 'search',
    dictRepo:
      'https://api.github.com/repos/island-is/elasticsearch-dictionaries',
    s3Folder: '',
    locales: ['is', 'en'],
  },
}
