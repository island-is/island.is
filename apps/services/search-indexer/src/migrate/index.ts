import yargs from 'yargs'
import { logger } from '@island.is/logging'
import { environment } from '../environments/environment'
import * as aws from './aws'
import * as dictionary from './dictionary'
import * as elastic from './elastic'
import * as kibana from './kibana'
import {
  getElasticsearchIndex,
  getElasticVersion,
} from '@island.is/content-search-index-manager'

const { locales } = environment

class App {
  async run() {
    logger.info('Starting migration of dictionaries and ES config', environment)

    const hasAwsAccess = await aws.checkAWSAccess()

    let esPackages: aws.AwsEsPackage[]
    if (hasAwsAccess) {
      esPackages = await this.migrateAws()
    } else {
      logger.info('No aws access found running in local development mode')
      // get packageId list for local development packages have package ids matching filenames in the dictionary repo
      esPackages = dictionary.getFakeEsPackages() // TODO: Make ES migration get it's own aws packages?
    }

    await this.migrateES(esPackages)

    try {
      await this.migrateKibana()
    } catch (e) {
      logger.error('Failed migrating kibana', e)
    }

    logger.info('Done!')
  }

  private async migrateAws(): Promise<aws.AwsEsPackage[]> {
    logger.info('Starting aws migration')
    const repoDictionaryVersion = await dictionary.getDictionaryVersion()
    const awsDictionaryVersion = await aws.getDictionaryVersion()

    // we only try to update the dictionary files if we find a mismatch in version numbers
    if (repoDictionaryVersion !== awsDictionaryVersion) {
      logger.info('Dictionary version mismatch, updating dictionary', {
        repoVersion: repoDictionaryVersion,
        awsVersion: awsDictionaryVersion,
      })
      const dictionaries = await dictionary.getDictionaryFiles() // get files form dictionary repo
      const uploadedS3Files = await aws.updateS3DictionaryFiles(dictionaries) // upload repo files to s3
      const newEsPackages = await aws.createAwsEsPackages(
        uploadedS3Files,
        repoDictionaryVersion,
      ) // create packages for the new files in AWS ES
      await aws.associatePackagesWithAwsEs(newEsPackages) // attach the new packages to our AWS ES instance
      await aws.updateDictionaryVersion(repoDictionaryVersion) // update version file last to ensure process runs again on failure
    }

    // we get the associated packages from AWS ES and return them
    // this returns packages two versions back in time to support rollbacks
    const esPackages = await aws.getAllDomainEsPackages()

    /*
    we only want to return packages of current version
    else if dictionary is missing packages we might not see an error until old packages are deleted
    */
    const filteredAwsEsPackages = esPackages.filter((esPackage) => {
      const { version } = aws.parsePackageName(esPackage.packageName)
      return version === repoDictionaryVersion
    })

    logger.info('Aws migration completed')
    return filteredAwsEsPackages // es config needs the package ids when generating the index template
  }

  private async migrateES(esPackages: aws.AwsEsPackage[]): Promise<boolean> {
    logger.info('Starting elasticsearch migration')
    await elastic.checkAccess() // this throws if there is no connection hence ensuring we don't continue

    const results = await Promise.all(
      locales.map(
        async (locale): Promise<true | Error> => {
          const newIndexName = getElasticsearchIndex(locale)
          const newIndexExists = await elastic.checkIfIndexExists(newIndexName)

          if (!newIndexExists) {
            logger.info('New index not found, updating elasticsearch config', {
              locale,
              newIndexName,
            })

            try {
              await elastic.updateIndexTemplate(locale, esPackages)
              await elastic.importContentToIndex(locale, newIndexName, 'full')
            } catch (error) {
              logger.error('Failed to migrate to new index', {
                locale,
                newIndexName,
                error: error.message,
              })
              // remove the index so we try and migrate this index again on next migration
              await elastic.removeIndexIfExists(newIndexName)
              // resolve the promise to let migrations for other indices finish
              return error
            }
          } else {
            logger.info(
              'Elasticsearch index version matches code index version, skipping index update',
              {
                locale,
                newIndexName,
              },
            )
            logger.info('Initializing elastic data')
            // index mappers might have new rules so we run a initialize sync to make sure all data is up to date with this new version
            await elastic.importContentToIndex(
              locale,
              newIndexName,
              'initialize',
            )
          }
          return true
        },
      ),
    )

    // make sure we throw an error to stop deployment of this version if any index migration is faulty
    results.forEach((result) => {
      if (result !== true) {
        logger.error(
          'Failed to migrate all indices, terminating process to prevent deployment of faulty indices',
          {
            error: result.message,
          },
        )
        throw result
      }
    })

    // rank the search results so we can see if they change
    await elastic.rankSearchQueries(getElasticsearchIndex('is'))

    logger.info('Elasticsearch migration completed')
    return true
  }

  private async migrateKibana() {
    logger.info('Starting kibana migration')
    const version = getElasticVersion()
    await kibana.importObjects(version)
    logger.info('Done')
  }

  async syncKibana() {
    logger.info('Starting kibana syncing')
    await kibana.syncObjects()
    logger.info('Done')
  }
}

async function migrateBootstrap() {
  const argv = yargs(process.argv).argv
  const app = new App()
  if (argv.syncKibana) {
    await app.syncKibana()
  } else {
    await app.run()
  }
}

migrateBootstrap().catch((error) => {
  logger.error('ERROR: ', error)
  // take down container on error to prevent this search indexer from going live
  throw error
})
