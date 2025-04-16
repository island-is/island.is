import { Module } from '@nestjs/common'
import { BloodClientService } from './blood.service'
import { BloodApiProvider } from './blood.provider'

@Module({
  providers: [BloodClientService, BloodApiProvider],
  exports: [BloodClientService],
})
export class BloodClientModule {}
