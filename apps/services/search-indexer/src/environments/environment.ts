export interface Environment {
  elasticNode: string
  esDomain: string
  s3Bucket: string
  s3Folder: string
  awsRegion: string
  dictRepo: string
  locales: string[]
}

export const environment: Environment = {
  elasticNode: process.env.ELASTIC_NODE || '',
  s3Bucket: process.env.S3_BUCKET,
  awsRegion: process.env.AWS_REGION,
  esDomain: 'search',
  s3Folder: '',
  dictRepo: 'https://api.github.com/repos/island-is/elasticsearch-dictionaries',
  locales: ['is', 'en'],
}
