import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import { Vehicle } from '../models/vehicle.model'
import { SkilavottordRepository } from './skilavottord.repository'

@Injectable()
export class SkilavottordService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private skilavottordRepository: SkilavottordRepository,
  ) {}

  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  async getVehicles(
    nationalId: string,
  ): Promise<Vehicle[] | null> {
    return await this.skilavottordRepository
      .getVehicles(nationalId)
      .catch(this.handleError.bind(this))
  }

}
