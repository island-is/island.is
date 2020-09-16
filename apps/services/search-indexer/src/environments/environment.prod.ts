import { Environment } from './environment'

export const environment: Environment = {
  elasticNode: process.env.ELASTIC_NODE,
  s3Bucket: process.env.S3_BUCKET,
  awsRegion: process.env.AWS_REGION,
  esDomain: 'search',
  dictRepo: 'https://api.github.com/repos/island-is/elasticsearch-dictionaries',
  s3Folder: '',
  locales: ['is', 'en'],
}
