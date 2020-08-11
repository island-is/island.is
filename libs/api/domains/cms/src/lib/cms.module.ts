import { Module } from '@nestjs/common'
import { CmsResolver } from './cms.resolver'

@Module({
  providers: [CmsResolver],
})
export class CmsModule {}
