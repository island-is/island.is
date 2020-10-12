import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { RestServiceCollector } from './restservicecollector.service'

@Injectable()
export class CollectorScheduler {
  constructor(private readonly restServiceCollector: RestServiceCollector) {}

  async indexTask(): Promise<void> {
    logger.info('Starting scheduler indexTask()')

    await this.restServiceCollector.indexServices()

    // here we could add indexing of SOAP services

    logger.info('Finished scheduler indexTask()')
    return
  }
}
