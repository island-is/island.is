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

    if (
      (await this.collectionService.fetchAllIndexNames()).includes(
        this.collectionService.getAliasName(),
      )
    )
      throw new Error(
        `Elastic index named "${this.collectionService.getAliasName()}" exists, it must be deleted ` +
          `before running the collector.  We need this name name for an alias!\n\n` +
          `Earlier the collector used the name "${this.collectionService.getAliasName()}" for an index.  This new collection process uses it for an alias.`,
      )
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
        if (createCollectionAlias && addedItems) {
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

    logger.info(
      `\n                                       ----------------------------------------------------\n` +
        `                                      |      Added all local services to worker index      |\n` +
        `                                       ----------------------------------------------------\n`,
    )
    logger.debug(
      `Making worker index "${this.collectionService.getWorkerIndexName()}" available for collectors from other environments`,
    )
    await this.collectionService.ActivateWorkerIndexForRemoteEnvironments()
    logger.debug(
      `Environment alias for "${this.collectionService.getEnvironment()}" ready for queries from remote environments`,
    )

    logger.info('Processing other environments.')
    await this.collectionService.copyServicesFromOtherEnvironments()
    logger.debug(
      `Done processing other environments at: ${new Date().toISOString()}`,
    )

    await this.collectionService.ActivateWorkerIndexForWeb()

    //TODO: if another instance of the collector is running in the same
    //TODO: environment, the line below, will delete it's index.
    await this.collectionService.deleteDanglingIndices()
    logger.info(
      `Service collection done on ${this.collectionService.getEnvironment()}.`,
    )
  }
}
