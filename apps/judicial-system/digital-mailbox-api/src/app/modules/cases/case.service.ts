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
import { DefenderChoice } from '@island.is/judicial-system/types'

import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { CaseResponse } from './models/case.response'
import { CasesResponse } from './models/cases.response'
import { InternalCaseResponse } from './models/internal/internalCase.response'
import { InternalCasesResponse } from './models/internal/internalCases.response'
import { InternalDefendantResponse } from './models/internal/internalDefendant.response'
import { RulingResponse } from './models/ruling.response'
import { SubpoenaResponse } from './models/subpoena.response'
import { caseModuleConfig } from './case.config'

@Injectable()
export class CaseService {
  constructor(
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly auditTrailService: AuditTrailService,
    private readonly lawyersService: LawyersService,
  ) {}

  async getCases(nationalId: string, lang?: string): Promise<CasesResponse[]> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_INDICTMENTS,
      this.getCasesInfo(nationalId, lang),
      nationalId,
    )
  }

  async getCase(
    caseId: string,
    nationalId: string,
    lang?: string,
  ): Promise<CaseResponse> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_INDICTMENT,
      this.getCaseInfo(caseId, nationalId, lang),
      () => caseId,
    )
  }

  async getSubpoena(
    caseId: string,
    nationalId: string,
    lang?: string,
  ): Promise<SubpoenaResponse> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_SUBPOENA,
      this.getSubpoenaInfo(caseId, nationalId, lang),
      nationalId,
    )
  }

  async updateSubpoena(
    nationalId: string,
    caseId: string,
    updateSubpoena: UpdateSubpoenaDto,
    lang?: string,
  ): Promise<SubpoenaResponse> {
    return await this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.UPDATE_SUBPOENA,
      this.updateSubpoenaInfo(nationalId, caseId, updateSubpoena, lang),
      nationalId,
    )
  }

  async getRuling(
    nationalId: string,
    caseId: string,
    lang?: string,
  ): Promise<RulingResponse> {
    return await this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_RULING,
      this.getRulingInfo(nationalId, caseId, lang),
      nationalId,
    )
  }

  private async getCasesInfo(
    nationalId: string,
    lang?: string,
  ): Promise<CasesResponse[]> {
    const response = await this.fetchCases(nationalId)

    return CasesResponse.fromInternalCasesResponse(response, lang)
  }

  private async getCaseInfo(
    caseId: string,
    nationalId: string,
    lang?: string,
  ): Promise<CaseResponse> {
    const response = await this.fetchCase(caseId, nationalId)

    return CaseResponse.fromInternalCaseResponse(response, lang)
  }

  private async getSubpoenaInfo(
    caseId: string,
    defendantNationalId: string,
    lang?: string,
  ): Promise<SubpoenaResponse> {
    const caseData = await this.fetchCase(caseId, defendantNationalId)

    return SubpoenaResponse.fromInternalCaseResponse(
      caseData,
      defendantNationalId,
      lang,
    )
  }

  private async updateSubpoenaInfo(
    defendantNationalId: string,
    caseId: string,
    defenderAssignment: UpdateSubpoenaDto,
    lang?: string,
  ): Promise<SubpoenaResponse> {
    let chosenLawyer = null

    if (defenderAssignment.defenderChoice === DefenderChoice.CHOOSE) {
      if (!defenderAssignment.defenderNationalId) {
        throw new NotFoundException(
          'Defender national id is required for choice',
        )
      }

      chosenLawyer = await this.lawyersService.getLawyer(
        defenderAssignment.defenderNationalId,
      )

      if (!chosenLawyer) {
        throw new NotFoundException(
          'Selected lawyer was not found in the lawyer registry',
        )
      }
    }

    const defenderChoice = {
      defenderChoice: defenderAssignment.defenderChoice,
      defenderNationalId: defenderAssignment.defenderNationalId,
      defenderName: chosenLawyer?.Name,
      defenderEmail: chosenLawyer?.Email,
      defenderPhoneNumber: chosenLawyer?.Phone,
      requestedDefenderChoice: defenderAssignment.defenderChoice,
      requestedDefenderNationalId: defenderAssignment.defenderNationalId,
      requestedDefenderName: chosenLawyer?.Name,
    }
    await this.patchDefenseInfo(defendantNationalId, caseId, defenderChoice)

    const updatedCase = await this.fetchCase(caseId, defendantNationalId)

    return SubpoenaResponse.fromInternalCaseResponse(
      updatedCase,
      defendantNationalId,
      lang,
    )
  }

  private async getRulingInfo(
    nationalId: string,
    caseId: string,
    lang?: string,
  ): Promise<RulingResponse> {
    const caseData = await this.fetchCase(caseId, nationalId)

    return RulingResponse.fromInternalCaseResponse(caseData, lang)
  }

  private async fetchCases(
    nationalId: string,
  ): Promise<InternalCasesResponse[]> {
    try {
      const res = await fetch(
        `${this.config.backendUrl}/api/internal/cases/indictments/defendant/${nationalId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
        },
      )

      if (!res.ok) {
        throw new BadGatewayException(
          'Unexpected error occurred while fetching cases',
        )
      }

      return await res.json()
    } catch (reason) {
      throw new BadGatewayException(`Failed to fetch cases: ${reason.message}`)
    }
  }

  private async fetchCase(
    caseId: string,
    nationalId: string,
  ): Promise<InternalCaseResponse> {
    try {
      const res = await fetch(
        `${this.config.backendUrl}/api/internal/case/indictment/${caseId}/defendant/${nationalId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
        },
      )

      if (!res.ok) {
        if (res.status === 404) {
          throw new NotFoundException(`Case ${caseId} not found`)
        }

        const reason = await res.text()

        throw new BadGatewayException(
          reason || 'Unexpected error occurred while fetching case by ID',
        )
      }

      const caseData = await res.json()

      return caseData
    } catch (reason) {
      if (
        reason instanceof BadGatewayException ||
        reason instanceof NotFoundException
      ) {
        throw reason
      }

      throw new BadGatewayException(
        `Failed to fetch case by id: ${reason.message}`,
      )
    }
  }

  private async patchDefenseInfo(
    defendantNationalId: string,
    caseId: string,
    defenderChoice: {
      requestedDefenderChoice: DefenderChoice
      requestedDefenderNationalId: string | undefined
      requestedDefenderName?: string
    },
  ): Promise<InternalDefendantResponse> {
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
        (await response.json()) as InternalDefendantResponse

      return {
        id: updatedDefendant.id,
        defenderChoice: updatedDefendant.defenderChoice,
        defenderName: updatedDefendant.defenderName,
      } as InternalDefendantResponse
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadGatewayException(
        error.message || 'An unexpected error occurred',
      )
    }
  }
}
