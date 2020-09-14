import { Controller, Get, Query } from '@nestjs/common'
import { IndexingService } from './indexing.service'
import { logger } from '@island.is/logging'
import { SearchIndexes } from '@island.is/api/content-search'

@Controller('')
export class IndexingController {
  constructor(
    private readonly indexingService: IndexingService) { }

  @Get('/')
  async hello() {
    return {
      ready: true,
    }
  }

  @Get('ping')
  async ping() {
    return this.indexingService.ping()
  }

  @Get('sync')
  async sync(@Query('locale') locale: keyof typeof SearchIndexes = 'is') {
    logger.info('Doing sync')
    await this.indexingService.doSync({fullSync: false, locale})
    return {
      acknowledge: true,
    }
  }

  @Get('re-sync')
  async resync(@Query('locale') locale: keyof typeof SearchIndexes = 'is') {
    logger.info('Doing re-sync')
    await this.indexingService.doSync({fullSync: true, locale})
    return {
      acknowledge: true,
    }
  }
}
