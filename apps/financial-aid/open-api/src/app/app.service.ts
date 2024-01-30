import fetch from 'isomorphic-fetch'

import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import appModuleConfig from './app.config'
import { CreateCaseDto } from './app.dto'
import { Case } from './app.model'

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async createCase(caseToCreate: CreateCaseDto): Promise<Case> {
    return fetch(`${this.config.backend.url}/api/internal/case/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.config.backend.accessToken}`,
      },
      body: JSON.stringify({
        ...caseToCreate,
        policeCaseNumber: undefined,
        policeCaseNumbers: [caseToCreate.policeCaseNumber],
      }),
    })
      .then(async (res) => {
        const response = await res.json()

        if (res.ok) {
          return { id: response?.id }
        }

        if (res.status < 500) {
          throw new BadRequestException(response?.detail)
        }

        throw response
      })
      .catch((reason) => {
        if (reason instanceof BadRequestException) {
          throw reason
        }

        throw new BadGatewayException({
          ...reason,
          message: 'Failed to create a new case',
        })
      })
  }
}
