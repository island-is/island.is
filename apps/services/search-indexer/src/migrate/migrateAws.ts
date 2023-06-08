import { logger } from '@island.is/logging'
import * as aws from './lib/aws'
import * as dictionary from './lib/dictionary'
import * as indexManager from '@island.is/content-search-index-manager'

class App {
  async run(): Promise<boolean> {
    logger.info('Starting migration of dictionaries to AWS')

    const dictionaryVersion = indexManager.getDictionaryVersion() // returns versions of the dictionary in order with the newest version first

    logger.info('Requesting files for dictionary version', {
      version: dictionaryVersion,
    })

    const versionsDictionaryFiles =
      await dictionary.getDictionaryFilesForVersion(dictionaryVersion)

    // we will always validate packages against (s3 -> AWS ES -> AWS ES search domain) to ensure we don't have partial updates
    logger.info('Starting validation of S3 and AWS packages')
    const s3Files = await aws.uploadS3DictionaryFiles(versionsDictionaryFiles) // upload repo files to s3
    const newEsPackages = await aws.createAwsEsPackages(s3Files) // create the dictionary packages files in AWS ES
    await aws.associatePackagesWithAwsEsSearchDomain(newEsPackages) // attach the new packages to our AWS ES search domain
    logger.info('All S3 and AWS packages up to date, AWS migration complete')
    return true
  }
}

async function migrateBootstrap() {
  const app = new App()
  await app.run()
}

export default async () => {
  await migrateBootstrap().catch((error) => {
    logger.error('ERROR: ', error)
    // take down container on error to prevent this search indexer from going live
    throw error
  })
}
