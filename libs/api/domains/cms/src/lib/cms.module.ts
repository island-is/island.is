import { Module } from '@nestjs/common'
import { CmsResolver, LatestNewsSliceResolver } from './cms.resolver'

@Module({
  providers: [CmsResolver, LatestNewsSliceResolver],
})
export class CmsModule {}
