import { Module } from '@nestjs/common'

import { CourtClientService } from './courtClient.service'
import { CourtClientAvailableService } from './courtClientAvailable.service'
import { CourtClientUnavailableService } from './courtClientUnavailable.service'
import { courtClientModuleConfig } from './courtClient.config'

const courtClientProvider = {
  provide: CourtClientService,
  useClass: courtClientModuleConfig().courtApiAvailable
    ? CourtClientAvailableService
    : CourtClientUnavailableService,
}
@Module({
  providers: [courtClientProvider],
  exports: [courtClientProvider],
})
export class CourtClientModule {}
