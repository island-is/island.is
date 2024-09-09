import fetch from 'isomorphic-fetch'

import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { InternalCaseResponse } from './models/internal/internalCase.response'
import { InternalDefendantResponse } from './models/internal/internalDefendant.response'
import { SubpoenaResponse } from './models/subpoena.response'
import appModuleConfig from './app.config'
import { CreateCaseDto } from './app.dto'
import { Case } from './app.model'

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}
  async create(caseToCreate: CreateCaseDto): Promise<Case> {
    return this.auditTrailService.audit(
      'xrd-api',
      AuditedAction.CREATE_CASE,
      this.createCase(caseToCreate),
      (theCase) => theCase.id,
    )
  }

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

  async getSubpoena(
    caseId: string,
    subpoenaId: string,
  ): Promise<SubpoenaResponse> {
    return this.auditTrailService.audit(
      'xrd-api',
      AuditedAction.GET_SUBPOENA,
      this.getSubpoenaInfo(caseId, subpoenaId),
      subpoenaId,
    )
  }

  async updateSubpoena(
    nationalId: string,
    caseId: string,
    updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    return await this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.UPDATE_SUBPOENA,
      this.updateSubpoenaInfo(nationalId, caseId, updateSubpoena),
      nationalId,
    )
  }

  private async getSubpoenaInfo(
    caseId: string,
    subpoenaId: string,
  ): Promise<SubpoenaResponse> {
    return fetch(
      `${this.config.backend.url}/api/internal/cases/indictment/${caseId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.config.backend.accessToken}`,
        },
        body: JSON.stringify({ nationalId: subpoenaId }),
      },
    )
      .then(async (res) => {
        const response = (await res.json()) as InternalCaseResponse

        if (res.ok) {
          const defendantInfo = response?.defendants?.find(
            (defendant) => defendant.nationalId === subpoenaId, // TODO: Use subpoenaId instead of nationalId
          )

          return {
            caseId: response?.id,
            defenderInfo: {
              defenderChoice: defendantInfo?.defenderChoice,
              defenderName: defendantInfo?.defenderName,
            },
          } as SubpoenaResponse
        }

        if (res.status < 500) {
          throw new BadRequestException()
        }

        throw response
      })
      .catch((reason) => {
        if (reason instanceof BadRequestException) {
          throw reason
        }

        throw new BadGatewayException({
          ...reason,
          message: 'Failed to retrieve subpoena',
        })
      })
  }

  private async updateSubpoenaInfo(
    caseId: string,
    nationalId: string,
    updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    return fetch(
      `${this.config.backend.url}/api/internal/case/${caseId}/defense/${nationalId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.config.backend.accessToken}`,
        },
        body: JSON.stringify(updateSubpoena),
      },
    )
      .then(async (res) => {
        const response = (await res.json()) as InternalDefendantResponse

        if (res.ok) {
          return {
            caseId: response.id,
            subpoenaComment: response.subpoenaComment,
            defenderInfo: {
              defenderChoice: response.defenderChoice,
              defenderName: response.defenderName,
            },
          } as SubpoenaResponse
        }

        if (res.status < 500) {
          throw new BadRequestException(response)
        }

        throw response
      })
      .catch((reason) => {
        if (reason instanceof BadRequestException) {
          throw reason
        }

        throw new BadGatewayException({
          ...reason,
          message: 'Failed to update subpoena',
        })
      })
  }
}
