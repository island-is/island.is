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
import { LawyersService } from '@island.is/judicial-system/lawyers'
import { DefenderChoice, ServiceStatus } from '@island.is/judicial-system/types'

import { UpdateSubpoenaDto } from './dto/subpoena.dto'
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
    private readonly lawyersService: LawyersService,
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

  async updateSubpoena(
    subpoenaId: string,
    updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    return await this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.UPDATE_SUBPOENA,
      this.updateSubpoenaInfo(subpoenaId, updateSubpoena),
      subpoenaId,
    )
  }

  private async updateSubpoenaInfo(
    subpoenaId: string,
    updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    let defenderInfo: {
      defenderName: string | undefined
      defenderEmail: string | undefined
      defenderPhoneNumber: string | undefined
    } = {
      defenderName: undefined,
      defenderEmail: undefined,
      defenderPhoneNumber: undefined,
    }

    if (
      updateSubpoena.defenderChoice === DefenderChoice.CHOOSE &&
      !updateSubpoena.defenderNationalId
    ) {
      throw new BadRequestException(
        'Defender national id is required for choice',
      )
    }

    if (updateSubpoena.defenderNationalId) {
      try {
        const chosenLawyer = await this.lawyersService.getLawyer(
          updateSubpoena.defenderNationalId,
        )
        defenderInfo = {
          defenderName: chosenLawyer.Name,
          defenderEmail: chosenLawyer.Email,
          defenderPhoneNumber: chosenLawyer.Phone,
        }
      } catch (reason) {
        // TODO: Reconsider throwing - what happens if registry is down?
        this.logger.error(
          `Failed to retrieve lawyer with national id ${updateSubpoena.defenderNationalId}`,
          reason,
        )
        throw new BadRequestException('Lawyer not found')
      }
    }

    //TODO: move logic to reusable place if this is the data structure we keep
    const serviceStatus = updateSubpoena.deliveredToLawyer
      ? ServiceStatus.DEFENDER
      : updateSubpoena.prosecutedConfirmedSubpoenaThroughIslandis
      ? ServiceStatus.ELECTRONICALLY
      : updateSubpoena.deliveredOnPaper || updateSubpoena.delivered === true
      ? ServiceStatus.IN_PERSON
      : updateSubpoena.acknowledged === false
      ? ServiceStatus.FAILED
      : // TODO: handle expired
        undefined

    const updateToSend = {
      serviceStatus,
      comment: updateSubpoena.comment,
      servedBy: updateSubpoena.servedBy,
      serviceDate: updateSubpoena.servedAt,
      defenderChoice: updateSubpoena.defenderChoice,
      defenderNationalId: updateSubpoena.defenderNationalId,
      defenderName: defenderInfo.defenderName,
      defenderEmail: defenderInfo.defenderEmail,
      defenderPhoneNumber: defenderInfo.defenderPhoneNumber,
    }

    try {
      const res = await fetch(
        `${this.config.backend.url}/api/internal/subpoena/${subpoenaId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backend.accessToken}`,
          },
          body: JSON.stringify(updateToSend),
        },
      )

      const response = await res.json()

      if (res.ok) {
        return {
          subpoenaComment: response.comment,
          defenderInfo: {
            defenderChoice: response.defendant.defenderChoice,
            defenderName: response.defendant.defenderName,
          },
        } as SubpoenaResponse
      }

      if (res.status < 500) {
        throw new BadRequestException(response?.detail)
      }

      throw response
    } catch (reason) {
      if (reason instanceof BadRequestException) {
        throw reason
      }

      throw new BadGatewayException({
        ...reason,
        message: 'Failed to update subpoena',
      })
    }
  }
}
