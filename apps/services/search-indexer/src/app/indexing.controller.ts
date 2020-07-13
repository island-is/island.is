import { Controller, Get } from '@nestjs/common'

import { IndexingService } from './indexing.service'
import { SearchIndexes } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'

@Controller('index')
export class IndexingController {
  constructor(private readonly indexingService: IndexingService) {}

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
}
