import { Controller, Get, Param } from '@nestjs/common'
import { IndexingService } from './indexing.service'
import { SearchIndexes } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'

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
  async sync() {
    logger.info('Doing sync')
    await this.indexingService.doSync({fullSync: false, locale: 'is'})
    return {
      acknowledge: true,
    }
  }

  @Get('sync-one/:id')
  async syncOne(@Param('id') id: string) {
    logger.debug('Sync one', { id: id })
    // noinspection ES6MissingAwait
    this.indexingService.syncById(SearchIndexes.is, id)
    return {
      acknowledge: true,
    }
  }

  @Get('re-sync')
  async resync() {
    logger.info('Doing re-sync')
    await this.indexingService.doSync({fullSync: true, locale: 'is'})
    return {
      acknowledge: true,
    }
  }
}
