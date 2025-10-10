import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { type ConfigType } from '@island.is/nest/config'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  DefenderChoice,
  EventType,
  isCompletedCase,
} from '@island.is/judicial-system/types'

import { appModuleConfig } from '../../app.config'
import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { UpdateVerdictAppealDecisionDto } from './dto/verdictAppeal.dto'
import { CaseResponse } from './models/case.response'
import { CasesResponse } from './models/cases.response'
import { InternalCaseResponse } from './models/internal/internalCase.response'
import { InternalCasesResponse } from './models/internal/internalCases.response'
import { InternalDefendantResponse } from './models/internal/internalDefendant.response'
import { SubpoenaResponse } from './models/subpoena.response'
import { VerdictResponse } from './models/verdict.response'

@Injectable()
export class CaseService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    private readonly auditTrailService: AuditTrailService,
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
        throw new BadRequestException(
          'Defender national id is required for choice',
        )
      }

      const res = await fetch(
        `${this.config.backendUrl}/api/lawyer-registry/${defenderAssignment.defenderNationalId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
        },
      )

      if (res.ok) {
        chosenLawyer = await res.json()

        if (!chosenLawyer) {
          throw new NotFoundException(
            'Selected lawyer was not found in the lawyer registry',
          )
        }
      }
    }

    const defenderChoice = {
      defenderChoice: defenderAssignment.defenderChoice,
      defenderNationalId: defenderAssignment.defenderNationalId,
      defenderName: chosenLawyer?.name,
      defenderEmail: chosenLawyer?.email,
      defenderPhoneNumber: chosenLawyer?.phoneNumber,
      requestedDefenderChoice: defenderAssignment.defenderChoice,
      requestedDefenderNationalId: defenderAssignment.defenderNationalId,
      requestedDefenderName: chosenLawyer?.name,
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

    const isCaseSentToPublicProsecutor = caseData.eventLogs?.some(
      (eventLog) =>
        eventLog.eventType === EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    )
    // we also have to ensure that the verdict is completed, confirmed and sent to public prosecutor.
    // sent to public prosecutor indicates that the verdict has been delivered to police if that was requested
    if (!isCompletedCase(caseData.state) || !isCaseSentToPublicProsecutor) {
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
    const response = await this.makeRequest(
      `${this.config.backendUrl}/api/internal/cases/indictments/defendant/${nationalId}`,
      'GET',
    )
    return response.json()
  }

  private async fetchCase(
    caseId: string,
    nationalId: string,
  ): Promise<InternalCaseResponse> {
    const response = await this.makeRequest(
      `${this.config.backendUrl}/api/internal/case/indictment/${caseId}/defendant/${nationalId}`,
      'GET',
    )
    return response.json()
  }

  private async patchDefendant(
    caseId: string,
    nationalId: string,
    updates: Record<string, unknown>,
  ): Promise<InternalDefendantResponse> {
    const response = await this.makeRequest(
      `${this.config.backendUrl}/api/internal/case/${caseId}/defense/${nationalId}`,
      'PATCH',
      updates,
    )

    const updatedDefendant =
      (await response.json()) as InternalDefendantResponse
    return {
      id: updatedDefendant.id,
      defenderChoice: updatedDefendant.defenderChoice,
      defenderName: updatedDefendant.defenderName,
    } as InternalDefendantResponse
  }

  private async patchVerdictAppeal(
    caseId: string,
    nationalId: string,
    verdictAppeal: UpdateVerdictAppealDecisionDto,
  ): Promise<void> {
    await this.makeRequest(
      `${this.config.backendUrl}/api/internal/case/${caseId}/defendant/${nationalId}/verdict-appeal`,
      'PATCH',
      { appealDecision: verdictAppeal.verdictAppealDecision },
    )
  }

  private async makeRequest(
    url: string,
    method: 'GET' | 'PATCH',
    body?: unknown,
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.config.secretToken}`,
        },
        ...(typeof body !== 'undefined' ? { body: JSON.stringify(body) } : {}),
      })

      if (!response.ok) {
        await this.handleHttpError(response, url)
      }

      return response
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error
      }

      throw new BadGatewayException(
        `Request failed for ${url}: ${error.message || 'Unknown error'}`,
      )
    }
  }

  private async handleHttpError(
    response: Response,
    url: string,
  ): Promise<never> {
    const status = response.status

    if (status === 400) {
      throw new BadRequestException('Bad request')
    }

    if (status === 404) {
      throw new NotFoundException('Resource not found')
    }

    if (status === 403) {
      throw new ForbiddenException('Access denied or operation not allowed')
    }

    let errorMessage = 'Request failed'
    try {
      const errorBody = await response.json()
      errorMessage = errorBody.message || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }

    throw new BadGatewayException(`${errorMessage} (${status}) for ${url}`)
  }
}
