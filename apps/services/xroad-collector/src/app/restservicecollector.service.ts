import { Injectable } from '@nestjs/common'
import { ProviderService } from '@island.is/api-catalogue/services'
import { ServiceCollector } from './servicecollector.interface'
import { logger } from '@island.is/logging'
import { RestMetadataService } from '@island.is/api-catalogue/services'
import { Provider, providerToString } from '@island.is/api-catalogue/types'
import { CollectionService } from './collection.service'

@Injectable()
export class RestServiceCollector implements ServiceCollector {
  constructor(
    private readonly providerService: ProviderService,
    private readonly restMetadataService: RestMetadataService,
    private readonly collectionService: CollectionService,
  ) {}

  async indexServices(): Promise<void> {
    logger.info('Start indexing of REST services')

    const providers = await this.providerService.getProviders()

    await this.indexProviders(providers.protected.concat(providers.public))

    logger.info('Finished indexing of REST services')
  }

  private async indexProviders(providers: Array<Provider>): Promise<void> {
    // Get latest state in X-Road in this environment
    let createCollectionAlias = true
    let addedItems: boolean

    for (const provider of providers) {
      try {
        // For each provider get list af all REST services
        // currently supporting those who were registered using OpenAPI
        const services = await this.restMetadataService.getServices(
          provider,
          this.collectionService.getEnvironment(),
        )

        // Insert into Elastic worker index
        addedItems = await this.collectionService.bulkWorker(services, true)
        if (addedItems && createCollectionAlias) {
          await this.collectionService.createCollectorWorkingAlias()
          createCollectionAlias = false
        }
      } catch (err) {
        logger.error(
          `Failed to index service metadata for provider ${providerToString(
            provider,
          )}`,
          err,
        )
      }
    }

    logger.debug(
      `Added all services to index "${this.collectionService.getWorkerIndexName()}"`,
    )
    logger.debug(
      `Adding index "${this.collectionService.getAliasName()}" to alias at: ${new Date().toISOString()}`,
    )
    await this.collectionService.ActivateWorkerIndex()
    logger.debug(`Done updating values at: ${new Date().toISOString()}`)

    logger.info('Processing other environments.')
    await this.collectionService.copyValuesFromOtherEnvironments()

    //TODO: if another instance of the collector is running in the same
    //TODO: environment, the line below, will delete it's index.
    await this.collectionService.deleteDanglingIndices()
    logger.info(`Collecting done on ${this.collectionService.getEnvironment()}`)
  }
}
