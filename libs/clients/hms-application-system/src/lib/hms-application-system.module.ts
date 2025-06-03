import { Module } from '@nestjs/common'
import { HmsApplicationSystemService } from './hms-application-system.service'
import { ApplicationApi, ApplicationManagerApi } from '../../gen/fetch'

@Module({
  providers: [
    ApplicationApi,
    ApplicationManagerApi,
    HmsApplicationSystemService,
  ],
  exports: [HmsApplicationSystemService],
})
export class HmsApplicationSystemModule {}
