import { Module } from '@nestjs/common'
import { HMSApiProvider } from './HMSApiProvider'

@Module({
  providers: [HMSApiProvider],
  exports: [HMSApiProvider],
})
export class HMSClientModule {}
