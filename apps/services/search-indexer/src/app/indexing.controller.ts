import { Controller, Get, Param } from '@nestjs/common'

import { IndexingService } from './indexing.service'
import { SearchIndexes } from '@island.is/api/content-search'

@Controller('index')
export class IndexingController {
  constructor(private readonly indexingService: IndexingService) {}

  @Get('sync')
  async sync() {
    const syncToken = await this.indexingService.getLastSyncToken(SearchIndexes.is)
    if (syncToken) {
      this.indexingService.continueSync(syncToken, SearchIndexes.is)
    } else {
      this.indexingService.initialSync(SearchIndexes.is)
    }
    return {
      acknowledge: true,
    }
  }
}
