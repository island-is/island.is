import { Module } from '@nestjs/common'
import { CmsResolver, ArticleResolver, LatestNewsSliceResolver } from './cms.resolver'

@Module({
  providers: [CmsResolver, ArticleResolver, LatestNewsSliceResolver],
})
export class CmsModule {}
