import {
  BadGatewayException,
  BadRequestException,
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

import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { UpdateVerdictAppealDecisionDto } from './dto/verdictAppeal.dto'
import { CaseResponse } from './models/case.response'
import { CasesResponse } from './models/cases.response'
import { InternalCaseResponse } from './models/internal/internalCase.response'
import { InternalCasesResponse } from './models/internal/internalCases.response'
import { InternalDefendantResponse } from './models/internal/internalDefendant.response'
import { SubpoenaResponse } from './models/subpoena.response'
import { VerdictResponse } from './models/verdict.response'
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
    caseId: string,
    nationalId: string,
    updateSubpoena: UpdateSubpoenaDto,
    lang?: string,
  ): Promise<SubpoenaResponse> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.UPDATE_SUBPOENA,
      this.updateSubpoenaInfo(caseId, nationalId, updateSubpoena, lang),
      nationalId,
    )
  }

  async updateVerdictAppeal(
    caseId: string,
    nationalId: string,
    verdictAppeal: UpdateVerdictAppealDecisionDto,
    lang?: string,
  ): Promise<VerdictResponse> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.UPDATE_VERDICT_APPEAL_DECISION,
      this.updateVerdictAppealDecisionInfo(
        caseId,
        nationalId,
        verdictAppeal,
        lang,
      ),
      nationalId,
    )
  }

  async getVerdict(
    caseId: string,
    nationalId: string,
    lang?: string,
  ): Promise<VerdictResponse> {
    return this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.GET_VERDICT,
      this.getVerdictInfo(caseId, nationalId, lang),
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
    nationalId: string,
    lang?: string,
  ): Promise<SubpoenaResponse> {
    const caseData = await this.fetchCase(caseId, nationalId)

    return SubpoenaResponse.fromInternalCaseResponse(caseData, nationalId, lang)
  }

  private async updateSubpoenaInfo(
    caseId: string,
    nationalId: string,
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

    await this.patchDefendant(caseId, nationalId, defenderChoice)

    const updatedCase = await this.fetchCase(caseId, nationalId)

    return SubpoenaResponse.fromInternalCaseResponse(
      updatedCase,
      nationalId,
      lang,
    )
  }

  private async getVerdictInfo(
    caseId: string,
    nationalId: string,
    lang?: string,
  ): Promise<VerdictResponse> {
    const caseData = await this.fetchCase(caseId, nationalId)

    if (!isCompletedCase(caseData.state)) {
      throw new BadRequestException(
        `Verdict is not available for case ${caseId}. Case must be completed before verdict can be accessed.`,
      )
    }

    if (!caseData.rulingDate) {
      throw new NotFoundException(
        `Verdict has not been issued for case ${caseId}`,
      )
    }

    return VerdictResponse.fromInternalCaseResponse(caseData, nationalId, lang)
  }

  private async updateVerdictAppealDecisionInfo(
    caseId: string,
    nationalId: string,
    verdictAppeal: UpdateVerdictAppealDecisionDto,
    lang?: string,
  ): Promise<VerdictResponse> {
    await this.patchVerdictAppeal(caseId, nationalId, verdictAppeal)

    const updatedCase = await this.fetchCase(caseId, nationalId)
    return VerdictResponse.fromInternalCaseResponse(
      updatedCase,
      nationalId,
      lang,
    )
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

  private async patchDefendant(
    caseId: string,
    nationalId: string,
    updates: Record<string, unknown>,
  ): Promise<InternalDefendantResponse> {
    try {
      const response = await fetch(
        `${this.config.backendUrl}/api/internal/case/${caseId}/defense/${nationalId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
          body: JSON.stringify(updates),
        },
      )

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new BadGatewayException(
          `Failed to update defendant: ${
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
        verdictAppealDecision: updatedDefendant.verdictAppealDecision,
      } as InternalDefendantResponse
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadGatewayException(
        error.message ||
          'An unexpected error occurred while updating defendant',
      )
    }
  }
  private async patchVerdictAppeal(
    caseId: string,
    nationalId: string,
    verdictAppeal: UpdateVerdictAppealDecisionDto,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.config.backendUrl}/api/internal/case/${caseId}/defendant/${nationalId}/verdict-appeal`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
          body: JSON.stringify(verdictAppeal),
        },
      )

      if (!response.ok) {
        if (response.status === 403) {
          throw new BadGatewayException(
            'Appeal deadline has passed or appeal not allowed',
          )
        }
        if (response.status === 404) {
          throw new NotFoundException('Case or defendant not found')
        }

        const errorResponse = await response.json()
        throw new BadGatewayException(
          `Failed to submit verdict appeal: ${
            errorResponse.message || response.statusText
          }`,
        )
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error
      }
      throw new BadGatewayException(
        error.message ||
          'An unexpected error occurred while submitting verdict appeal',
      )
    }
  }
}
