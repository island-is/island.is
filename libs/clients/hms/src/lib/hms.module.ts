import { Module } from '@nestjs/common'
import {
  HmsAdalmatseiningApiProvider,
  HmsFasteignApiProvider,
  HmsStadfangApiProvider,
} from './hms.provider'
import { HmsService } from './hms.service'
import { AssetsClientModule } from '@island.is/clients/assets'

@Module({
  imports: [AssetsClientModule],
  providers: [
    HmsStadfangApiProvider,
    HmsFasteignApiProvider,
    HmsAdalmatseiningApiProvider,
    HmsService,
  ],
  exports: [HmsService],
})
export class HmsModule {}
