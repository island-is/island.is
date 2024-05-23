import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import appModuleConfig from './app.config'

interface IndictmentCase {
  id: string
  courtCaseNumber: string
  type: string
}

interface Response {
  id: string
  caseNumber: string
  type: string
}

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  private async test(): Promise<string> {
    return 'OK'
  }

  async testConnection(): Promise<string> {
    //TODO: Audit
    return this.test()
  }

  private format(response: IndictmentCase[], lang?: string): Response[] {
    return response.map((item: IndictmentCase) => {
      const language = lang?.toLowerCase()

      return {
        id: item.id,
        caseNumber:
          language === 'en'
            ? `Case number ${item.courtCaseNumber}`
            : `Málsnúmer ${item.courtCaseNumber}`,
        type: language === 'en' ? 'Indictment' : 'Ákæra',
      }
    })
  }

  private async getAllCases(lang?: string): Promise<Response[]> {
    console.log(this.config.backend.url)
    return fetch(`${this.config.backend.url}/api/internal/cases/indictments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.config.backend.accessToken}`,
      },
    })
      .then(async (res) => {
        const response = await res.json()

        if (res.ok) {
          console.log(response)
          return this.format(response, lang)
        }

        if (res.status < 500) {
          throw new BadGatewayException(response?.detail)
        }

        throw response
      })
      .catch((reason) => {
        if (reason instanceof BadGatewayException) {
          throw reason
        }

        throw new BadGatewayException(reason)
      })
  }

  async getCases(lang?: string): Promise<Response[]> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_INDICTMENTS,
      this.getAllCases(lang),
      'OK',
    )
  }
}
