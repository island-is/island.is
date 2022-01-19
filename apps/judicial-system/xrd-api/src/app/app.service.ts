import fetch from 'isomorphic-fetch'

import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common'

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
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async createCase(caseToCreate: CreateCaseDto): Promise<Case> {
    const res = await fetch(`${environment.backend.url}/api/internal/case/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${environment.auth.secretToken}`,
      },
      body: JSON.stringify(caseToCreate),
    }).catch((reason) => {
      this.logger.error('Failed to create a new case', { reason })

      throw new BadGatewayException('Failed to create a new case')
    })

    if (!res.ok) {
      this.logger.info('Failed to create a new case', { res })

      if (res.status < 500) {
        throw new BadRequestException('Failed to create a new case')
      }

      throw new BadGatewayException('Failed to create a new case')
    }

    return res
      .json()
      .then((newCase: TCase) => ({ id: newCase.id }))
      .catch((reason) => {
        this.logger.error('Failed to create a new case', { reason })

        throw new BadGatewayException('Failed to create a new case')
      })
  }

  async create(caseToCreate: CreateCaseDto): Promise<Case> {
    return this.auditTrailService.audit(
      'xrd-api',
      AuditedAction.CREATE_CASE,
      this.createCase(caseToCreate),
      (theCase) => theCase.id,
    )
  }
}
