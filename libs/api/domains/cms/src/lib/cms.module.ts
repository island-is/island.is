import { Module } from '@nestjs/common'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
} from './cms.resolver'
import { CmsService } from './cms.service'
import { ContentfulRepository } from './contentful.repository'

@Module({
  providers: [
    CmsResolver,
    ArticleResolver,
    LatestNewsSliceResolver,
    CmsService,
    ContentfulRepository,
  ],
  exports: [ContentfulRepository],
})
export class CmsModule {}
