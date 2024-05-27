import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import { isCompletedCase } from '@island.is/judicial-system/types'

import { CaseResponse } from './models/case.response'
import { CasesResponse } from './models/cases.response'
import { InternalCaseResponse } from './models/internalCase.response'
import { InternalCasesResponse } from './models/internalCases.response'
import { digitalMailboxModuleConfig } from './app.config'

@Injectable()
export class AppService {
  constructor(
    @Inject(digitalMailboxModuleConfig.KEY)
    private readonly config: ConfigType<typeof digitalMailboxModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  private async test(nationalId: string): Promise<string> {
    return `OK ${nationalId}`
  }

  async testConnection(nationalId: string): Promise<string> {
    return this.test(nationalId)
  }

  private format(
    response: InternalCasesResponse[],
    lang?: string,
  ): CasesResponse[] {
    return response.map((item: InternalCasesResponse) => {
      const language = lang?.toLowerCase()

      return {
        id: item.id,
        state: {
          color: isCompletedCase(item.state) ? 'purple' : 'blue',
          label:
            language === 'en'
              ? isCompletedCase(item.state)
                ? 'Completed'
                : 'Active'
              : isCompletedCase(item.state)
              ? 'Lokið'
              : 'Í vinnslu',
        },
        caseNumber:
          language === 'en'
            ? `Case number ${item.courtCaseNumber}`
            : `Málsnúmer ${item.courtCaseNumber}`,
        type: language === 'en' ? 'Indictment' : 'Ákæra',
      }
    })
  }

  private formatCase(res: InternalCaseResponse, lang?: string): CaseResponse {
    const language = lang?.toLowerCase()

    return {
      data: {
        caseNumber:
          language === 'en'
            ? `Case number ${res.courtCaseNumber}`
            : `Málsnúmer ${res.courtCaseNumber}`,
        groups: [
          {
            label: language === 'en' ? 'Defendant' : 'Varnaraðili',
            items: [
              {
                label: language === 'en' ? 'Name' : 'Nafn',
                value: res.defendants[0].name,
              },
              {
                label: language === 'en' ? 'National ID' : 'Kennitala',
                value: res.defendants[0].nationalId,
              },
              {
                label: language === 'en' ? 'Address' : 'Heimilisfang',
                value:
                  res.defendants[0].address ?? language === 'en'
                    ? 'N/A'
                    : 'Ekki skráð',
              },
            ],
          },
          {
            label: language === 'en' ? 'Defender' : 'Verjandi',
            items: [
              {
                label: language === 'en' ? 'Name' : 'Nafn',
                value: res.defendants[0].defenderName,
              },
              {
                label: language === 'en' ? 'Email' : 'Netfang',
                value:
                  res.defendants[0].defenderEmail ?? language === 'en'
                    ? 'N/A'
                    : 'Ekki skráð',
                linkType: 'email',
              },
              {
                label: language === 'en' ? 'Phone Nr.' : 'Símanúmer',
                value:
                  res.defendants[0].defenderPhoneNumber ?? language === 'en'
                    ? 'N/A'
                    : 'Ekki skráð',
                linkType: 'tel',
              },
            ],
          },
          {
            label: language === 'en' ? 'Information' : 'Málsupplýsingar',
            items: [
              {
                label: language === 'en' ? 'Type' : 'Tegund',
                value: language === 'en' ? 'Indictment' : 'Ákæra',
              },
              {
                label:
                  language === 'en' ? 'Case number' : 'Málsnúmer héraðsdóms',
                value: res.courtCaseNumber,
              },
              {
                label: language === 'en' ? 'Court' : 'Dómstóll',
                value: res.court.name,
              },
              {
                label: language === 'en' ? 'Judge' : 'Dómari',
                value: res.judge.name,
              },
              {
                label: language === 'en' ? 'Institution' : 'Embætti',
                value: res.prosecutorsOffice.name,
              },
              {
                label: language === 'en' ? 'Prosecutor' : 'Ákærandi',
                value: res.prosecutor.name,
              },
            ],
          },
        ],
      },
    }
  }

  private async getAllCases(
    nationalId: string,
    lang?: string,
  ): Promise<CasesResponse[]> {
    return fetch(`${this.config.backendUrl}/api/internal/cases/indictments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.config.secretToken}`,
      },
      body: JSON.stringify({ nationalId }),
    })
      .then(async (res) => {
        const response = await res.json()

        if (res.ok) {
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

  private async getCase(
    id: string,
    nationalId: string,
    lang?: string,
  ): Promise<CaseResponse> {
    console.log('getCase', id)
    return fetch(
      `${this.config.backendUrl}/api/internal/cases/indictment/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.config.secretToken}`,
        },
        body: JSON.stringify({ nationalId }),
      },
    )
      .then(async (res) => {
        const response = await res.json()

        if (res.ok) {
          return this.formatCase(response, lang)
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

  async getCases(nationalId: string, lang?: string): Promise<CasesResponse[]> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_INDICTMENTS,
      this.getAllCases(nationalId, lang),
      nationalId,
    )
  }

  async getCaseById(
    id: string,
    nationalId: string,
    lang?: string,
  ): Promise<CaseResponse> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_INDICTMENT,
      this.getCase(id, nationalId, lang),
      () => id,
    )
  }
}
