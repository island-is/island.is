import { environment } from '../environments/environment'
import * as AWS from 'aws-sdk'
import { logger } from '@island.is/logging'
import { Client } from '@elastic/elasticsearch'
import { AwsSignedConnection, UnsignedConnection } from './awsEsConnector'

const { elastic } = environment

export class EsClientFactory {
  static create() {
    const hasAWS = Boolean(AWS.config?.credentials?.accessKeyId)
    //todo handle pool?
    logger.info('Create ES Client', {
      esConfig: elastic,
      withAwsClient: hasAWS,
    })
    return new Client({
      Connection: hasAWS ? AwsSignedConnection : UnsignedConnection,
      node: elastic.node,
    })
  }
}
