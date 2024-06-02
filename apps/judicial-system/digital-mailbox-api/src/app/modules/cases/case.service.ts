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

  async updateSubpoena(
    nationalId: string,
    caseId: string,
    updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    return await this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.ASSIGN_DEFENDER_TO_SUBPOENA,
      this.updateSubpoenaDefender(nationalId, caseId, updateSubpoena),
      nationalId,
    )
  }

  private async getAllCases(
    nationalId: string,
    lang?: string,
  ): Promise<CasesResponse[]> {
    const response = await this.fetchCases(nationalId)
    return CasesResponse.fromInternalCasesResponse(response, lang)
  }

  private async getCase(
    id: string,
    nationalId: string,
    lang?: string,
  ): Promise<CaseResponse> {
    const response = await this.fetchCase(id, nationalId)
    return CaseResponse.fromInternalCaseResponse(response, lang)
  }

  async getSubpoena(
    caseId: string,
    defendantNationalId: string,
  ): Promise<SubpoenaResponse> {
    const caseData = await this.fetchCase(caseId, defendantNationalId)

    console.log('caseData', caseData)

    return SubpoenaResponse.fromInternalCaseResponse(
      caseData,
      defendantNationalId,
    )
  }

  private async updateSubpoenaDefender(
    defendantNationalId: string,
    caseId: string,
    defenderAssignment: UpdateSubpoenaDto,
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

    await this.patchSubpoenaDefender(
      defendantNationalId,
      caseId,
      defenderChoice,
    )

    const updatedCase = await this.fetchCase(caseId, defendantNationalId)

    return SubpoenaResponse.fromInternalCaseResponse(
      updatedCase,
      defendantNationalId,
    )
  }

  private async fetchCases(
    nationalId: string,
  ): Promise<InternalCasesResponse[]> {
    try {
      const res = await fetch(
        `${this.config.backendUrl}/api/internal/cases/indictments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
          body: JSON.stringify({ nationalId }),
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
    id: string,
    nationalId: string,
  ): Promise<InternalCaseResponse> {
    try {
      const res = await fetch(
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

      if (!res.ok) {
        if (res.status === 404) {
          throw new NotFoundException(`Case ${id} not found`)
        }

        const reason = await res.text()

        throw new BadGatewayException(
          reason || 'Unexpected error occurred while fetching case by ID',
        )
      }

      return await res.json()
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

  private async patchSubpoenaDefender(
    defendantNationalId: string,
    caseId: string,
    defenderChoice: UpdateSubpoenaDto,
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
