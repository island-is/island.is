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

    logger.info('Finding protected service providers')
    const protectedProviders = await this.providerService.getProtectedProviders()
    logger.info(
      `Found ${protectedProviders.length} protected service providers`,
    )

    logger.info('Finding public service providers')
    const publicProviders = await this.providerService.getPublicProviders()
    logger.info(`Found ${publicProviders.length} public service providers`)

    await this.indexProviders(protectedProviders.concat(publicProviders))

    logger.info('Finished indexing of REST services')
  }

  private async indexProviders(providers: Array<Provider>): Promise<void> {
    for (const provider of providers) {
      // For each provider get list af all REST services
      // currently supporting those who were registered using OpenAPI
      const services = await this.restMetadataService.getServices(provider)

      // Insert into Elastic
      await this.elasticService.bulk(services)
    }
  }
}
