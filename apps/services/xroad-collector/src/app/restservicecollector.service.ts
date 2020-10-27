import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Injectable } from '@nestjs/common'
import { ProviderService } from '@island.is/api-catalogue/services'
import { ServiceCollector } from './servicecollector.interface'
import { logger } from '@island.is/logging'
import { RestMetadataService } from '@island.is/api-catalogue/services'
import { Provider } from '@island.is/api-catalogue/types'

@Injectable()
export class RestServiceCollector implements ServiceCollector {
  constructor(
    private readonly providerService: ProviderService,
    private readonly restMetadataService: RestMetadataService,
    private readonly elasticService: ElasticService,
  ) {}

  async indexServices(): Promise<void> {
    logger.info('Start indexing of REST services')

    const protectedProviders = await this.providerService.getProtectedProviders()
    const publicProviders = await this.providerService.getPublicProviders()

    await this.indexProviders(protectedProviders.concat(publicProviders))

    logger.info('Finished indexing of REST services')
  }

  private async indexProviders(providers: Array<Provider>): Promise<void> {
    // Remove the index so we can recreate it
    // with the latest state in X-Road
    await this.elasticService.deleteIndex()

    for (const provider of providers) {
      try {
        // For each provider get list af all REST services
        // currently supporting those who were registered using OpenAPI
        const services = await this.restMetadataService.getServices(provider)

        // Insert into Elastic
        await this.elasticService.bulk(services)
      } catch (err) {
        logger.error(
          `Failed to index service metadata for provider ${Provider.toString(
            provider,
          )}`,
          err,
        )
      }
    }
  }
}
