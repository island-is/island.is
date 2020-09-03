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
    indexMain: string
    esDomain: string
    codeTemplateFile: string
    dictRepo: string
    s3Bucket: string
    s3Folder: string
    awsRegion: string
    packagePrefix: string
    isRunningLocally: boolean
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
    isRunningLocally: !!process.env.ELASTIC_NODE,
    elasticNode: process.env.ELASTIC_NODE || '',
    s3Bucket: process.env.S3_BUCKET || 'prod-es-custom-packages',
    awsRegion: process.env.AWS_REGION || 'eu-west-1',
    indexMain: 'island-is',
    esDomain: 'search',
    codeTemplateFile: '/webapp/config/template-is.json',
    dictRepo: 'https://api.github.com/repos/island-is/elasticsearch-dictionaries',
    s3Folder: '',
    packagePrefix: ''
  }
}
