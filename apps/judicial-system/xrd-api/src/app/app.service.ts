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

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import { CaseOrigin } from '@island.is/judicial-system/types'

import appModuleConfig from './app.config'
import { CreateCaseDto } from './app.dto'
import { Case } from './app.model'

function reportError(
  url: string,
  title: { title: string; emoji: string },
  info?: string,
  error?: unknown,
) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${title.emoji} *${title.title}*\n${info}${
              error ? `\n>${JSON.stringify(error)}` : ''
            }`,
          },
        },
      ],
    }),
  })
}

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    private readonly auditTrailService: AuditTrailService,
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

  async create(caseToCreate: CreateCaseDto): Promise<Case> {
    return this.auditTrailService
      .audit(
        'xrd-api',
        AuditedAction.CREATE_CASE,
        this.createCase(caseToCreate),
        (theCase) => theCase.id,
      )
      .catch((reason) => {
        reportError(
          this.config.errorReportUrl,
          {
            title: 'Ekki tókst að stofna mál í gegnum Strauminn',
            emoji: ':broken_heart:',
          },
          `${capitalize(caseTypes[caseToCreate.type])}: ${
            caseToCreate.policeCaseNumber
          }\nOrigin: ${CaseOrigin.LOKE}`,
          reason,
        )

        throw reason
      })
  }
}
