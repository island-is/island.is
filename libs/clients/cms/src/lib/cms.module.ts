import { Module } from '@nestjs/common'
import { CmsService } from './cms.service'
import { CmsFetchProvider } from './cms-fetch-provider'

@Module({
  providers: [CmsFetchProvider, CmsService],
  exports: [CmsService],
})
export class CmsModule { }
