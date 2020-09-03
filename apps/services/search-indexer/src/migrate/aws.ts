import { ListDomainNamesResponse } from 'aws-sdk/clients/es'
import { logger } from '@island.is/logging'
import AWS from 'aws-sdk'
import { environment } from '../environments/environment'

AWS.config.update({ region: environment.migrate.awsRegion })
export const awsEs = new AWS.ES()

export const checkAWSAccess = async () => {
  const domains: ListDomainNamesResponse = await awsEs.listDomainNames().promise()
    
  logger.info('Validating esDomain agains aws domain list', domains)
  const hasDomain = domains.DomainNames.find(domain => domain.DomainName === environment.migrate.esDomain)

  if (!hasDomain) {
    throw new Error('Domain not found')
  }
}