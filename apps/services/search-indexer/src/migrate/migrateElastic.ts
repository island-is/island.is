import { logger } from '@island.is/logging'
import { environment } from '../environments/environment'
import * as aws from './lib/aws'
import * as dictionary from './lib/dictionary'
import * as elastic from './lib/elastic'
import * as indexManager from '@island.is/content-search-index-manager'
import yargs from 'yargs'

const { locales } = environment

class App {
  async run() {
    logger.info('Starting elasticsearch migration')
    const hasAwsAccess = await aws.checkAWSAccess()

    // get dictionary AWS ES packages
    let esPackages: aws.AwsEsPackage[]
    if (hasAwsAccess) {
      // get all packages for this version associated to the AWS ES search domain
      const dictionaryVersion = indexManager.getDictionaryVersion()
      esPackages = await aws.getAssociatedEsPackages(dictionaryVersion)

      // we should always have some packages here
      if (!esPackages.length) {
        new Error(
          `Failed to get dictionary packages from AWS ES search domain for the given version: ${dictionaryVersion}`,
        )
      }
    } else {
      logger.info('No aws access found running in local development mode')
      /*
      get packageId list for local development
      packages have package ids matching filenames in the dictionary repo
      this references local package names shipped with our development ES cluster
      */
      esPackages = dictionary.getFakeEsPackages()
    }

    logger.info('Found es packages', ...esPackages)

    await elastic.checkAccess() // this throws if there is no connection hence ensuring we don't continue

    const results = await Promise.all(
      locales.map(async (locale): Promise<true | Error> => {
        const newIndexName = indexManager.getElasticsearchIndex(locale)
        const newIndexExists = await elastic.checkIfIndexExists(newIndexName)

        if (!newIndexExists) {
          logger.info('New index not found, updating elasticsearch config', {
            locale,
            newIndexName,
          })

          try {
            await elastic.updateIndexTemplate(locale, esPackages)
            logger.info('updated template', { newIndexName })
            await elastic.importContentToIndex(locale, newIndexName, 'full')

            const oldIndexName = await elastic.getPreviousIndex(locale)
            if (oldIndexName) {
              await elastic.migratePopularityScores(oldIndexName, newIndexName)
              logger.info('Popularity scores from previous index migrated', {
                oldIndexName,
              })
            } else {
              logger.info(
                'No older index found, skipping popularity score migration',
                { locale },
              )
            }
          } catch (error) {
            logger.error('Failed to migrate to new index', {
              locale,
              newIndexName,
              error: error.message,
            })
            // remove the index to make migration run again for this index
            await elastic.removeIndexIfExists(newIndexName)
            // resolve the promise instead of throw to let migrations for other indices finish
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
          await elastic.importContentToIndex(locale, newIndexName, 'initialize')
        }
        return true
      }),
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
    await elastic.rankSearchQueries(indexManager.getElasticsearchIndex('is'))

    logger.info('Elasticsearch migration completed')
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

const argv = yargs(process.argv.slice(2)).argv
if (argv['run-migrations']) {
  migrateBootstrap().catch((error) => {
    logger.error('ERROR: ', error)
  })
}
