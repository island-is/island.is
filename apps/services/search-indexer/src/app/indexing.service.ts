import { Injectable } from '@nestjs/common'
import { SearchIndexes } from '@island.is/api/content-search'
import { ElasticService } from '@island.is/api/content-search'

@Injectable()
export class IndexingService {
  private elasticService: ElasticService
  constructor() {
    // todo replace with di
    this.elasticService = new ElasticService()
  }
  async indexDocument(index: SearchIndexes, document) {
    return this.elasticService.index(index, document)
  }
}
