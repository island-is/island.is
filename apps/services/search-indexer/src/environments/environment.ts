export interface Environment {
  production: boolean
  contentful: {
    space: string
    accessToken: string
    environment: string
    host: string
  }
  indexableTypes: string[]
  migrate: {
    elasticNode: string
    esDomain: string
    s3Bucket: string
    s3Folder: string
    awsRegion: string
    dictRepo: string
    locales: string[]
  }
}

export const environment: Environment = {
  production: false,
  contentful: {
    space: process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'test',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
  },
  indexableTypes: ['article'],
  migrate: {
    elasticNode: process.env.ELASTIC_NODE || '',
    s3Bucket: process.env.S3_BUCKET || 'prod-es-custom-packages',
    awsRegion: process.env.AWS_REGION || 'eu-west-1',
    esDomain: 'search',
    s3Folder: '',
    dictRepo:
      'https://api.github.com/repos/island-is/elasticsearch-dictionaries',
    locales: ['is', 'en'],
  },
}
