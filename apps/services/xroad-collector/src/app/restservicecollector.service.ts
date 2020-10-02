import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Injectable } from '@nestjs/common'
import { ProviderService } from './provider.service'
import { ServiceCollector } from './servicecollector.interface'
import { logger } from '@island.is/logging'
import { Provider } from '@island.is/api-catalogue/types'
import { RestMetadataService } from './restmetadata.service'

@Injectable()
export class RestServiceCollector implements ServiceCollector {
  constructor(
    private readonly providerService: ProviderService,
    private readonly restMetadataService: RestMetadataService,
    private readonly elasticService: ElasticService,
  ) {}

  async indexServices(): Promise<void> {
    logger.info('Start indexing of REST services...')
    const protectedProviders: Array<Provider> = await this.providerService.getProtectedProviders()
    logger.debug(`Found ${protectedProviders.length} protected clients...`)

    for (const provider of protectedProviders) {
      // Get list af all REST service that have OpenAPI
      const services = await this.restMetadataService.getServices(provider)

      // Insert into Elastic
      await this.elasticService.bulk(services)
    }
  }
}
