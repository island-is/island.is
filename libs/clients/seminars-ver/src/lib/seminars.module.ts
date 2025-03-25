import { Module } from '@nestjs/common'
import { SeminarsClientService } from './seminars.service'
import { exportedApis } from './providers'

@Module({
  providers: [SeminarsClientService, ...exportedApis],
  exports: [SeminarsClientService],
})
export class SeminarsClientModule {}
