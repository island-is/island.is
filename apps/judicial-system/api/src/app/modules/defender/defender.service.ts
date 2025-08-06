import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { type Lawyer } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'

@Injectable()
export class DefenderService {
  constructor(
    private readonly backendService: BackendService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getLawyers(): Promise<Lawyer[]> {
    return this.backendService.getLawyers()
  }
}
