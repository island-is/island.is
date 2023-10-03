import { Module } from '@nestjs/common'

import { courtClientModuleConfig } from './courtClient.config'
import {
  CourtClientService,
  CourtClientServiceImplementation,
  CourtClientServiceUnavailableImplementation,
} from './courtClient.service'

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
