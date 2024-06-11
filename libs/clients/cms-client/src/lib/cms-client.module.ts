import { Module } from '@nestjs/common'
import { CmsClientService } from './cms-client.service'
import { CmsClientFetchProvider } from './cms-client-fetch-provider'

@Module({
  providers: [CmsClientFetchProvider, CmsClientService],
  exports: [CmsClientService],
})
export class CmsClientModule {}
