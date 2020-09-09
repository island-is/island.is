import { Module } from '@nestjs/common'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
} from './cms.resolver'
import { ContentfulRepository } from './contentful.repository'

@Module({
  providers: [CmsResolver, ArticleResolver, LatestNewsSliceResolver, ContentfulRepository],
  exports: [ContentfulRepository],
})

export class CmsModule {}
