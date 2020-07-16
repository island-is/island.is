import { environment } from '../environments/environment'
import * as AWS from 'aws-sdk'
import { logger } from '@island.is/logging'
import { Client } from '@elastic/elasticsearch'
import { AwsSignedConnection, UnsignedConnection } from './awsEsConnector'

const { elastic } = environment

export class EsClientFactory {
  static create() {
    const hasAWS = this.hasAWS()
    if (hasAWS) {
      this.initCredentials()
    }
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

  private static hasAWS(): boolean {
    return (
      'AWS_WEB_IDENTITY_TOKEN_FILE' in process.env ||
      'AWS_SECRET_ACCESS_KEY' in process.env
    )
  }

  private static initCredentials() {
    if (AWS.config.credentials) {
      return
    }

    AWS.config.getCredentials((err) => {
      logger.debug('Trying to initialize AWS Credentials')

      if (!err) {
        return
      }

      logger.error('AWS Credentials Error', {
        error: err,
      })

      throw new Error('AWS Credentials Error')
    })
  }
}
