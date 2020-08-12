import { Module } from '@nestjs/common'
import { ContentSearchService } from './contentSearch.service'
import { ContentSearchResolver } from './contentSearch.resolver'
import { ElasticModule } from '@island.is/api/content-search'

@Module({
  imports: [ElasticModule],
  providers: [ContentSearchResolver, ContentSearchService],
})
export class ContentSearchModule {}
