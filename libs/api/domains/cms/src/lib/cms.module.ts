import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
} from './cms.resolver'

@Module({
  providers: [
    CmsResolver,
    ArticleResolver,
    LatestNewsSliceResolver,
    ElasticService,
  ],
})
export class CmsModule {}
