import { Controller, Get, Post, Param, Body } from '@nestjs/common'

import { IndexingService } from './indexing.service'
import {Document, SearchIndexes} from "@island.is/api/content-search";

@Controller('index')
export class IndexingController {
  constructor(private readonly appService: IndexingService) {}

  @Post(':type')
  async index(@Param('type') type, @Body() document: Document) {
    const indexType: SearchIndexes = SearchIndexes[type]
    await this.appService.indexDocument(indexType, document)
    return {
      'status': 'OK'
    }
  }
}
