import { Environment } from './environment'

export const environment: Environment = {
  elasticNode: process.env.ELASTIC_NODE,
  s3Bucket: process.env.S3_BUCKET,
  awsRegion: process.env.AWS_REGION,
  esDomain: 'search',
  dictRepo: 'island-is/elasticsearch-dictionaries',
  s3Folder: '',
  locales: ['is', 'en'],
  configPath: './config',
}
