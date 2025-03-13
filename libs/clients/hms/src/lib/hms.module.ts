import { Module } from '@nestjs/common'
import {
  HmsAdalmatseiningApiProvider,
  HmsFasteignApiProvider,
  HmsStadfangApiProvider,
} from './hms.provider'
import { HmsService } from './hms.service'

@Module({
  providers: [
    HmsStadfangApiProvider,
    HmsFasteignApiProvider,
    HmsAdalmatseiningApiProvider,
    HmsService,
  ],
  exports: [HmsService],
})
export class HmsModule {}
