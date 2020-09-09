import { Module } from '@nestjs/common'
import { CmsResolver, LatestNewsSliceResolver } from './cms.resolver'
import { ContentfulRepository } from './contentful.repository'

@Module({
  providers: [CmsResolver, LatestNewsSliceResolver, ContentfulRepository],
  exports: [ContentfulRepository],
})
export class CmsModule {}
