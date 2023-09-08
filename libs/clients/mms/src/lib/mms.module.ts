import { Module } from '@nestjs/common'
import { MMSApiProvider } from './mms.provider'

@Module({
  providers: [MMSApiProvider],
  exports: [MMSApiProvider],
})
export class MMSClientModule {}
