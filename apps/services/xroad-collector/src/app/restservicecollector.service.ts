import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Injectable } from '@nestjs/common'
import { ProviderService } from '@island.is/api-catalogue/services'
import { ServiceCollector } from './servicecollector.interface'
import { logger } from '@island.is/logging'
import { RestMetadataService } from '@island.is/api-catalogue/services'
import { Provider, providerToString } from '@island.is/api-catalogue/types'
import { ConfigService } from '@nestjs/config'
import { Environment } from 'libs/api-catalogue/consts/src'

interface ConfigValues {
  environment: Environment
  indexName: string
}
@Injectable()
export class RestServiceCollector implements ServiceCollector {
  constructor(
    private configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly restMetadataService: RestMetadataService,
    private readonly elasticService: ElasticService,
  ) {}

  getConfig(): ConfigValues {
    logger.debug('Checking config')
    const indexName = this.configService.get<string>('indexName')
    const environmentValue = this.configService.get<string>('environment')
    if (!indexName) {
      throw new Error(
        'Environment variable API_CATALOGUE_INDEX_NAME is missing',
      )
    }
    if (!environmentValue) {
      throw new Error('Environment variable ENVIRONMENT is missing')
    }

    const environment: Environment =
      Environment[
        Object.keys(Environment).find(
          (key) => Environment[key] === environmentValue,
        )
      ]

    if (!environment) {
      throw new Error(
        `Invalid value in environment variable "ENVIRONMENT". Valid values:[${Environment.DEV}|${Environment.STAGING}|${Environment.PROD}]`,
      )
    }

    const ret: ConfigValues = {
      indexName: indexName,
      environment: environment,
    }

    logger.info('Config values:', ret)
    return ret
  }

  async indexServices(): Promise<void> {
    logger.info('Start indexing of REST services')

    const providers = await this.providerService.getProviders()

    await this.indexProviders(providers.protected.concat(providers.public))

    logger.info('Finished indexing of REST services')
  }

  private async indexProviders(providers: Array<Provider>): Promise<void> {
    // Remove the worker index so we can re-create it
    // with the latest state in X-Road in this environment

    const config = this.getConfig()
    this.elasticService.initWorker(config.indexName, config.environment)
    for (const provider of providers) {
      try {
        // For each provider get list af all REST services
        // currently supporting those who were registered using OpenAPI
        const services = await this.restMetadataService.getServices(
          provider,
          config.environment,
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
      `Added all services to index "${this.elasticService.getIndexNameWorker()}" , so lets copy them to to index "${this.elasticService.getIndexName()}".`,
    )
    logger.debug(
      `Starting update for index "${this.elasticService.getIndexName()}" at: ${new Date().toISOString()}`,
    )
    await this.elasticService.moveWorkerValuesToIndex()
    logger.debug(`Done updating values at: ${new Date().toISOString()}`)
  }
}
