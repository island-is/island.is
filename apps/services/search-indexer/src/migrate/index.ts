import { logger } from '@island.is/logging'
import { environment, } from '../environments/environment'
import * as aws from './aws'
import * as dictionary from './dictionary'

class App {
  async run() {
    logger.info('Starting migration if needed', environment.migrate)
    const hasAwsAccess = await aws.checkAWSAccess()
    if (hasAwsAccess) {
      await this.migrateAws()
    }
    logger.info('Done!')
  }

  private async migrateAws() {
    const repoDictionaryVersion = await dictionary.getDictionaryVersion()
    const awsDictionaryVersion = await aws.getDictionaryVersion()
    if (repoDictionaryVersion !== awsDictionaryVersion) {
      logger.info('Dictionary version missmatch, updating dictionary', { repoVersion: repoDictionaryVersion, awsVersion: awsDictionaryVersion })
      const dictionaryFiles = await dictionary.getDictionaryFiles()
      logger.info('Got files', dictionaryFiles)
    }
  }
}

async function migrateBootstrap() {
  console.log(environment.migrate.elasticNode)
  if (environment.migrate.elasticNode === '') {
    logger.error('Config not valid', environment.migrate)
    return
  }

  const app = new App()
  await app.run()
}

migrateBootstrap().catch((error) => {
  logger.error('ERROR: ', error)
  // take down container on error
  throw error
})
