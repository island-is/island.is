import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AppSysVehicleInformation } from './appSysRecyclingReq.model'

@Injectable()
export class AppSysRecyclingReqService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  // TODO test
  async getUserVehiclesInformation(): Promise<AppSysVehicleInformation[]> {
    return [
      {
        permno: 'SR845',
      },
      {
        permno: 'PS888',
      },
    ]
  }
}
