import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import { CasesResponse } from './models/cases.response'
import { InternalCasesResponse } from './models/internalCases.response'
import appModuleConfig from './app.config'

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

  private format(
    response: InternalCasesResponse[],
    lang?: string,
  ): CasesResponse[] {
    return response.map((item: InternalCasesResponse) => {
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

  private async getAllCases(lang?: string): Promise<CasesResponse[]> {
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

  async getCases(lang?: string): Promise<CasesResponse[]> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_INDICTMENTS,
      this.getAllCases(lang),
      'OK',
    )
  }
}
