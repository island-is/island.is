import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Injectable } from '@nestjs/common'
import { ProviderService } from '@island.is/api-catalogue/services'
import { ServiceCollector } from './servicecollector.interface'
import { logger } from '@island.is/logging'
import { RestMetadataService } from '@island.is/api-catalogue/services'
import { Provider, providerToString } from '@island.is/api-catalogue/types'

@Injectable()
export class RestServiceCollector implements ServiceCollector {
  constructor(
    private readonly providerService: ProviderService,
    private readonly restMetadataService: RestMetadataService,
    private readonly elasticService: ElasticService,
  ) {}

  async indexServices(): Promise<void> {
    logger.info('Start indexing of REST services')

    const providers = await this.providerService.getProviders()

    await this.indexProviders(providers.protected.concat(providers.public))

    logger.info('Finished indexing of REST services')
  }

  private async indexProviders(providers: Array<Provider>): Promise<void> {
    // Remove the worker index so we can re-create it
    // with the latest state in X-Road in this environment
    await this.elasticService.deleteWorkerIndex()

    for (const provider of providers) {
      try {
        // For each provider get list af all REST services
        // currently supporting those who were registered using OpenAPI
        const services = await this.restMetadataService.getServices(
          provider,
          this.elasticService.getEnvironment(),
        )

        // Insert into Elastic worker index
        await this.elasticService.bulkWorker(services)
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
      `Added all services to index "${this.elasticService.getIndexNameWorker()}" , so lets copy them to to index "${this.elasticService.getIndexName()}". time is: ${new Date().toISOString()}`,
    )
    logger.debug(
      `Starting update for index "${this.elasticService.getIndexName()}" at: ${new Date().toISOString()}`,
    )
    await this.elasticService.moveWorkerValuesToIndex()
    logger.debug(`Done updating values at: ${new Date().toISOString()}`)
  }
}
