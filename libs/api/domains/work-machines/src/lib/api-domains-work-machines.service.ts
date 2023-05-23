import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Inject, Injectable } from '@nestjs/common'
import {
  MachinesApi,
  MachinesFriendlyHateaosDto,
} from '@island.is/clients/work-machines'
import { ApolloError } from 'apollo-server-express'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

/** Category to attach each log message to */
const LOG_CATEGORY = 'work-machines-service'

export class WorkMachinesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private machinesApi: MachinesApi,
  ) {}

  handleError(error: any, detail?: string): ApolloError | null {
    this.logger.error(detail || 'Vehicles error', {
      error: JSON.stringify(error),
      category: LOG_CATEGORY,
    })
    throw new ApolloError('Failed to resolve request', error.status)
  }

  private handle4xx(error: any, detail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, detail)
  }

  private getWorkMachinesWithAuth(auth: Auth) {
    return this.machinesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getWorkMachines(
    auth: User,
  ): Promise<MachinesFriendlyHateaosDto | null | ApolloError> {
    try {
      const res = await this.getWorkMachinesWithAuth(auth).apiMachinesGet({})
      if (!res) return null
      return res
    } catch (e) {
      return this.handle4xx(e, 'Failed to retrieve work machines')
    }
  }
}
