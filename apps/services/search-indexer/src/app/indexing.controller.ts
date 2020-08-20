import { Controller, Get, Param } from '@nestjs/common'
import { IndexingService } from './indexing.service'
import { SearchIndexes } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'

@Controller('')
export class IndexingController {
  constructor(private readonly indexingService: IndexingService) {}

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
    const syncToken = await this.indexingService.getLastSyncToken(
      SearchIndexes.is,
    )
    logger.debug('IndexSync', { token: syncToken })

    if (syncToken) {
      // noinspection ES6MissingAwait
      this.indexingService.continueSync(syncToken, SearchIndexes.is)
    } else {
      // noinspection ES6MissingAwait
      this.indexingService.initialSync(SearchIndexes.is)
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

  @Get('re-sync')
  async resync() {
    logger.debug('IndexReSync')

    // noinspection ES6MissingAwait
    this.indexingService.initialSync(SearchIndexes.is)
    return {
      acknowledge: true,
    }
  }
}
