import fetch from 'isomorphic-fetch'

import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { Case as TCase } from '@island.is/judicial-system/types'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import { environment } from '../environments'
import { CreateCaseDto } from './app.dto'
import { Case } from './app.model'

@Injectable()
export class AppService {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async createCase(caseToCreate: CreateCaseDto): Promise<Case> {
    return fetch(`${environment.backend.url}/api/internal/case/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${environment.auth.secretToken}`,
      },
      body: JSON.stringify(caseToCreate),
    })
      .then(async (res) => {
        if (!res.ok) {
          this.logger.error('Could not create a new case', res)

          throw new BadGatewayException('Could not create a new case')
        }

        return res.json().then((newCase: TCase) => ({ id: newCase.id }))
      })
      .catch((reason) => {
        if (reason instanceof BadGatewayException) {
          throw reason
        }

        this.logger.error('Could not create a new case', reason)

        throw new BadGatewayException('Could not create a new case')
      })
  }

  async create(caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.info('Creating a new case')

    return this.auditTrailService.audit(
      'xrd-api',
      AuditedAction.CREATE_CASE,
      this.createCase(caseToCreate),
      (theCase) => theCase.id,
    )
  }
}
