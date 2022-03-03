import { Module } from '@nestjs/common'

import { ElasticModule } from '@island.is/content-search-toolkit'

import { ContentSearchResolver } from './contentSearch.resolver'
import { ContentSearchService } from './contentSearch.service'

@Module({
  imports: [ElasticModule],
  providers: [ContentSearchResolver, ContentSearchService],
})
export class ContentSearchModule {}
