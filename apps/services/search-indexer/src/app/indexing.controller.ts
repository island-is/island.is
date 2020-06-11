import { Controller, Get, Param } from '@nestjs/common'

import { IndexingService } from './indexing.service'
import { SearchIndexes } from '@island.is/api/content-search'

@Controller('index')
export class IndexingController {
  constructor(private readonly appService: IndexingService) {}

  @Get('sync')
  async sync() {
    const syncToken = await this.appService.getLastSyncToken(SearchIndexes.is)
    if (syncToken) {
      this.appService.continueSync(syncToken, SearchIndexes.is)
    } else {
      this.appService.initialSync(SearchIndexes.is)
    }
    return {
      acknowledge: true,
    }
  }
}
