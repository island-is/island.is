import { Controller, Get, Param, Query } from '@nestjs/common'
import { IndexingService } from './indexing.service'
import { SearchIndexes } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'

@Controller('')
export class IndexingController {
  constructor(private readonly indexingService: IndexingService) { }

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
  async sync(@Query('language') language: keyof typeof SearchIndexes = 'is') {
    const syncToken = await this.indexingService.getLastSyncToken(language)
    logger.info('Continuing indexing from last sync', { language, token: syncToken })

    if (syncToken) {
      // noinspection ES6MissingAwait
      this.indexingService.continueSync(syncToken, language)
    } else {
      // noinspection ES6MissingAwait
      this.indexingService.initialSync(language)
    }
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

  // TODO: Block this from being called from outside
  @Get('re-sync')
  async resync(@Query('language') language: keyof typeof SearchIndexes = 'is') {
    logger.info('Reindexing all data', { language })

    // noinspection ES6MissingAwait
    this.indexingService.initialSync(language)
    return {
      acknowledge: true,
    }
  }
}
