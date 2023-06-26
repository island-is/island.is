import { Module } from '@nestjs/common'

import {
  CourtClientService,
  CourtClientServiceImplementation,
  CourtClientServiceUnavailableImplementation,
} from './courtClient.service'
import { courtClientModuleConfig } from './courtClient.config'

const courtClientProvider = {
  provide: CourtClientService,
  useClass: courtClientModuleConfig().courtApiAvailable
    ? CourtClientServiceImplementation
    : CourtClientServiceUnavailableImplementation,
}
@Module({
  providers: [courtClientProvider],
  exports: [courtClientProvider],
})
export class CourtClientModule {}
