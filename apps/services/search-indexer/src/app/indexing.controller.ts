import { Controller, Get, Param } from '@nestjs/common'

import { IndexingService } from './indexing.service'
import { SearchIndexes } from '@island.is/api/content-search'

@Controller('index')
export class IndexingController {
  constructor(private readonly appService: IndexingService) {}

  @Get('sync')
  async sync() {
    const syncToken = await this.appService.getLastSyncToken(SearchIndexes.test)
    if (syncToken) {
      this.appService.continueSync(syncToken, SearchIndexes.test)
    } else {
      this.appService.initialSync(SearchIndexes.test)
    }
  }
}
