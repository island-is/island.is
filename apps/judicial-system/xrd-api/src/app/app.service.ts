import fetch from 'isomorphic-fetch'

import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Case as TCase } from '@island.is/judicial-system/types'

import { environment } from '../environments'
import { CreateCaseDto } from './app.dto'
import { Case } from './app.model'

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.info('Creating a new case')

    const res = await fetch(`${environment.backend.url}/api/internal/case/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${environment.auth.secretToken}`,
      },
      body: JSON.stringify(caseToCreate),
    })

    if (!res.ok) {
      console.log('Could not create a new case', res)

      throw new BadGatewayException('Could not create a new case')
    }

    const newCase: TCase = await res.json()

    return { id: newCase.id }
  }
}
