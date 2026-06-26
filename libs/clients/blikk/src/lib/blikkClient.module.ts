import { Module } from '@nestjs/common'

import { BlikkClientService } from './blikkClient.service'
import { enhancedFetch } from './fetchConfig'

@Module({
  providers: [enhancedFetch, BlikkClientService],
  exports: [BlikkClientService],
})
export class BlikkClientModule {}
