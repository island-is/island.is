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
      const dictionaries = await dictionary.getDictionaryFiles() // get files form dictionary repo
      const uploadedS3Files = await aws.updateS3DictionaryFiles(dictionaries) // upload files to s3 with predictable names
      const packageIds = await aws.createAwsEsPackages(uploadedS3Files)
      // TOOD: Assosiate packages with AWS ES instance
      // TODO: Pass generated package id to ES config

      // TODO: Disassosiate old packages from AWS ES
      logger.info('Got files from repo', { fileCount: dictionaries.length })
      logger.info('Got ids', packageIds)
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
