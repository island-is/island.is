import { logger } from '@island.is/logging'
import { environment, } from '../environments/environment'
import * as aws from './aws'
import * as dictionary from './dictionary'
import * as elastic from './elastic'


class App {
  async run() {
    logger.info('Starting migration of dictionaries and ES config', environment.migrate)

    const hasAwsAccess = await aws.checkAWSAccess()

    let packageIds: aws.AwsEsPackage[]
    if (hasAwsAccess) {
      packageIds = await this.migrateAws()
    } else {
      logger.info('No aws access found running in local development mode')
      // get packageId list for local development packages have package ids matching filenames in the dictionary repo
      packageIds = dictionary.getFakePackageIds()
    }

    await this.migrateES(packageIds)

    if (hasAwsAccess) {
      logger.info('Cleaning up unused packages')
      // TODO: Get permission in AWS to do this
      // await aws.disassociatePackagesFromAwsEs(packageIds) // we disassociate all but the files in packageIds
      // await aws.deletePackagesFromAwsEs(packageIds) // we delete all but the files in packageIds
    }
    logger.info('Done!')
  }

  private async migrateAws() {
    logger.info('Starting aws migration')
    const repoDictionaryVersion = await dictionary.getDictionaryVersion()
    const awsDictionaryVersion = await aws.getDictionaryVersion()
    let esPackages: aws.AwsEsPackage[]
    // we only try to update teh dictionary files if we find a missmatch in version numbers
    if (repoDictionaryVersion !== awsDictionaryVersion) {
      logger.info('Dictionary version missmatch, updating dictionary', { repoVersion: repoDictionaryVersion, awsVersion: awsDictionaryVersion })
      const dictionaries = await dictionary.getDictionaryFiles() // get files form dictionary repo
      const uploadedS3Files = await aws.updateS3DictionaryFiles(dictionaries) // upload repo files to s3
      esPackages = await aws.createAwsEsPackages(uploadedS3Files, repoDictionaryVersion) // create packages for the new files in AWS ES
      await aws.associatePackagesWithAwsEs(esPackages) // attach the new packages to our AWS ES instance
      await aws.updateDictionaryVersion(repoDictionaryVersion) // update version file last to ensure process runs again on failure
    } else {
      logger.info('No need to update dictionary, getting current package ids for elasticsearch migration')
      esPackages = await aws.getAllDomainEsPackages()
    }
    logger.info('Aws migration completed')
    return esPackages // es config needs the package ids when generating the index template
  }

  private async migrateES(esPackages: aws.AwsEsPackage[]) {
    logger.info('Starting elasticsearch migration')
    await elastic.checkAccess() // this throws if there is no connection hence ensuring we dont continue
    const locales = environment.migrate.locales
    const requests = locales.map(async (locale) => {
      const oldIndexVersion = await elastic.getVersionFromIndices(locale)
      const newIndexVersion = await elastic.getVersionFromConfig(locale)

      if (oldIndexVersion !== newIndexVersion) {
        logger.info('Elasticsearch index version does not match code index version, updating elasticsearch config', { locale, esIndexVersion: oldIndexVersion, codeIndexVersion: newIndexVersion })

        try {
          // TODO: Get old template to roll back
          await elastic.updateIndexTemplate(locale, esPackages)
          await elastic.createNewIndexVersion(locale, newIndexVersion)
          await elastic.moveOldContentToNewIndex(locale, newIndexVersion, oldIndexVersion)
          await elastic.moveAliasToNewIndex(locale, newIndexVersion, oldIndexVersion)
        } catch (error) {
          logger.error('Failed to migrate to new index', { locale, newIndexVersion, oldIndexVersion, error })
          await elastic.revertToOldTemplate(newIndexVersion)
          await elastic.removeIndexVersion(newIndexVersion)
        }
      } else {
        logger.info('Elasticsearch index version matches code index version, no need to update index', { locale, esIndexVersion: oldIndexVersion, codeIndexVersion: newIndexVersion })
      }
      return true
    })

    await Promise.all(requests) // TODO: Revert all and crash
    logger.info('Elasticsearch migration completed')
    return true
  }
}

async function migrateBootstrap() {
  const app = new App()
  await app.run()
}

migrateBootstrap().catch((error) => {
  logger.error('ERROR: ', error)
  // take down container on error
  throw error
})
