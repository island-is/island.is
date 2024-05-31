import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { type ConfigType } from '@island.is/nest/config'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import { LawyersService } from '@island.is/judicial-system/lawyers'
import {
  DefenderChoice,
  isCompletedCase,
} from '@island.is/judicial-system/types'

import { CasesResponse } from './models/cases.response'
import { InternalCasesResponse } from './models/internalCases.response'
import { DefenderAssignmentDto } from './models/subpoena.dto'
import { SubpoenaResponse } from './models/subpoena.response'
import { UpdatedDefendantResponse } from './models/updatedDefendant.response'
import { caseModuleConfig } from './case.config'

@Injectable()
export class CaseService {
  constructor(
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly auditTrailService: AuditTrailService,
    private readonly lawyersService: LawyersService,
  ) {}

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

  private async test(nationalId: string): Promise<string> {
    return `OK ${nationalId}`
  }

  async testConnection(nationalId: string): Promise<string> {
    return this.test(nationalId)
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

  async getCases(nationalId: string, lang?: string): Promise<CasesResponse[]> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_INDICTMENTS,
      this.getAllCases(nationalId, lang),
      nationalId,
    )
  }

  async assignDefenderToSubpoena(
    nationalId: string,
    caseId: string,
    defenderAssignment: DefenderAssignmentDto,
  ): Promise<SubpoenaResponse> {
    return await this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.ASSIGN_DEFENDER_TO_SUBPOENA,
      this.assignDefender(nationalId, caseId, defenderAssignment),
      nationalId,
    )
  }

  private async patchDefender(
    defendantNationalId: string,
    caseId: string,
    defenderChoice: DefenderAssignmentDto,
  ): Promise<UpdatedDefendantResponse> {
    try {
      const response = await fetch(
        `${this.config.backendUrl}/api/internal/case/${caseId}/defense/${defendantNationalId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
          body: JSON.stringify(defenderChoice),
        },
      )

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new BadGatewayException(
          `Failed to assign defender: ${
            errorResponse.message || response.statusText
          }`,
        )
      }

      const updatedDefendant =
        (await response.json()) as UpdatedDefendantResponse

      return {
        id: updatedDefendant.id,
        defenderChoice: updatedDefendant.defenderChoice,
        defenderName: updatedDefendant.defenderName,
      } as UpdatedDefendantResponse
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadGatewayException(
        error.message || 'An unexpected error occurred',
      )
    }
  }

  private async assignDefender(
    defendantNationalId: string,
    caseId: string,
    defenderAssignment: DefenderAssignmentDto,
  ): Promise<SubpoenaResponse> {
    let defenderChoice = { ...defenderAssignment }

    if (
      defenderAssignment.defenderNationalId &&
      defenderAssignment.defenderChoice === DefenderChoice.CHOOSE
    ) {
      const lawyers = await this.lawyersService.getLawyers()
      const chosenLawyer = lawyers.find(
        (l) => l.SSN === defenderAssignment.defenderNationalId,
      )
      if (!chosenLawyer) {
        throw new NotFoundException('Lawyer not found')
      }

      defenderChoice = {
        ...defenderChoice,
        ...{
          defenderName: chosenLawyer.Name,
          defenderEmail: chosenLawyer.Email,
          defenderPhoneNumber: chosenLawyer.Phone,
        },
      }
    }

    const patchedDefender = await this.patchDefender(
      defendantNationalId,
      caseId,
      defenderChoice,
    )

    return new SubpoenaResponse()
  }
}
