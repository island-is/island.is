import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import path from 'path'

export interface Environment {
  elasticNode: string
  esDomain: string
  s3Bucket: string
  s3Folder: string
  dictRepo: string
  locales: ElasticsearchIndexLocale[]
  configPath: string
}

export const environment: Environment =
  process.env.NODE_ENV === 'production'
    ? {
        elasticNode: process.env.ELASTIC_NODE,
        s3Bucket: process.env.S3_BUCKET,
        esDomain: process.env.ELASTIC_DOMAIN,
        dictRepo: 'island-is/elasticsearch-dictionaries',
        s3Folder: '',
        locales: ['is', 'en'],
        configPath: './config',
      }
    : {
        elasticNode: process.env.ELASTIC_NODE || '',
        s3Bucket: process.env.S3_BUCKET,
        esDomain: process.env.ELASTIC_DOMAIN,
        s3Folder: '',
        dictRepo: 'island-is/elasticsearch-dictionaries',
        locales: ['is', 'en'],
        configPath: path.resolve(__dirname, '../../config'),
      }
