import { Inject, Injectable, HttpService, forwardRef } from '@nestjs/common'
import format from 'date-fns/format'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { AccessControlModel } from './accessControl.model'

@Injectable()
export class AccessControlService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  async findAll(): Promise<AccessControlModel[]> {
    this.logger.info('---- Starting findAll Recycling request ----')
    return Promise.resolve([
      {
        nationalId: '1234567890',
        name: 'foo bar',
        partnerId: '123',
        role: 'developer',
      },
    ] as AccessControlModel[])
  }

  createAccess(partnerId) {
    return null
  }

  updateAccess(partnerId) {
    return null
  }
}
