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
import { getRulingInstructionItems } from '@island.is/judicial-system/formatters'
import {
  DefenderChoice,
  InformationForDefendant,
  LawyerRegistry,
  LawyerType,
  mapPoliceVerdictDeliveryStatus,
  PoliceFileTypeCode,
  ServiceStatus,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

import { CreateCaseDto } from './dto/createCase.dto'
import { UpdatePoliceDocumentDeliveryDto } from './dto/policeDocument.dto'
import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { Case } from './models/case.model'
import { Groups } from './models/componentDefinitions/groups.model'
import { PoliceDocumentDelivery } from './models/policeDocumentDelivery.response'
import { SubpoenaResponse } from './models/subpoena.response'
import appModuleConfig from './app.config'

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

  async updateSubpoena(
    policeSubpoenaId: string,
    updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    return await this.auditTrailService.audit(
      'digital-mailbox-api',
      AuditedAction.UPDATE_SUBPOENA,
      this.updateSubpoenaInfo(policeSubpoenaId, updateSubpoena),
      policeSubpoenaId,
    )
  }

  async getLitigators(): Promise<LawyerRegistry[]> {
    try {
      const res = await fetch(
        `${this.config.backend.url}/api/lawyer-registry?lawyerType=${LawyerType.LITIGATORS}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backend.accessToken}`,
          },
        },
      )
      if (res.ok) {
        const lawyers = await res.json()

        return lawyers.map((lawyer: LawyerRegistry) => ({
          nationalId: lawyer.nationalId,
          name: lawyer.name,
          practice: lawyer.practice,
        }))
      }

      throw new BadRequestException()
    } catch (error) {
      this.logger.error('Failed to retrieve litigator lawyers', error)

      throw new BadRequestException('Failed to retrieve litigator lawyers')
    }
  }

  private async updateSubpoenaInfo(
    policeSubpoenaId: string,
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
        const res = await fetch(
          `${this.config.backend.url}/api/lawyer-registry/${updateSubpoena.defenderNationalId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${this.config.backend.accessToken}`,
            },
          },
        )

        if (res.ok) {
          const chosenLawyer = await res.json()

          defenderInfo = {
            defenderName: chosenLawyer.name,
            defenderEmail: chosenLawyer.email,
            defenderPhoneNumber: chosenLawyer.phoneNumber,
          }
        }
      } catch (reason) {
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
      requestedDefenderChoice: updateSubpoena.defenderChoice,
      requestedDefenderNationalId: updateSubpoena.defenderNationalId,
      requestedDefenderName: defenderInfo.defenderName,
    }

    try {
      const res = await fetch(
        `${this.config.backend.url}/api/internal/subpoena/${policeSubpoenaId}`,
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
            defenderChoice: response.defendant.requestedDefenderChoice,
            defenderName: response.defendant.requestedDefenderName,
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

  async updatePoliceDocumentDelivery(
    policeDocumentId: string,
    updatePoliceDocumentDelivery: UpdatePoliceDocumentDeliveryDto,
  ): Promise<PoliceDocumentDelivery> {
    switch (updatePoliceDocumentDelivery.fileTypeCode) {
      case PoliceFileTypeCode.VERDICT:
        return await this.auditTrailService.audit(
          'digital-mailbox-api',
          AuditedAction.UPDATE_VERDICT,
          this.updateVerdictDelivery(
            policeDocumentId,
            updatePoliceDocumentDelivery,
          ),
          policeDocumentId,
        )
    }

    throw new BadRequestException('Police file type code not supported')
  }

  private async updateVerdictDelivery(
    policeDocumentId: string,
    updatePoliceDocumentDelivery: UpdatePoliceDocumentDeliveryDto,
  ) {
    if (updatePoliceDocumentDelivery.deliverySupplements?.appealDecision) {
      const appealDecision =
        updatePoliceDocumentDelivery.deliverySupplements.appealDecision

      if (
        !Object.values(VerdictAppealDecision).includes(
          appealDecision as VerdictAppealDecision,
        )
      ) {
        throw new BadRequestException(
          `Invalid appeal_decision: ${appealDecision}. Must be one of: ${Object.values(
            VerdictAppealDecision,
          ).join(', ')}`,
        )
      }
    }

    const serviceStatus = mapPoliceVerdictDeliveryStatus({
      delivered: updatePoliceDocumentDelivery.delivered,
      deliveredOnPaper: updatePoliceDocumentDelivery.deliveredOnPaper,
      deliveredOnIslandis: updatePoliceDocumentDelivery.deliveredOnIslandis,
      deliveredToLawyer: updatePoliceDocumentDelivery.deliveredToLawyer,
      deliveredToDefendant: updatePoliceDocumentDelivery.deliveredToDefendant,
    })

    const parsedPoliceUpdate = {
      serviceDate: updatePoliceDocumentDelivery.servedAt,
      servedBy: updatePoliceDocumentDelivery.servedBy,
      comment: updatePoliceDocumentDelivery.comment,
      serviceStatus: serviceStatus,
      deliveredToDefenderNationalId:
        updatePoliceDocumentDelivery.defenderNationalId,
      appealDecision:
        updatePoliceDocumentDelivery.deliverySupplements?.appealDecision ??
        undefined,
    }
    try {
      const res = await fetch(
        `${this.config.backend.url}/api/internal/verdict/${policeDocumentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backend.accessToken}`,
          },
          body: JSON.stringify(parsedPoliceUpdate),
        },
      )
      // TODO: When we update the verdict appeal decision, call verdict-appeal endpoint to validate and update the appeal decision specifically
      // once service date has been recorded for the verdict

      const response = await res.json()

      if (res.ok) {
        return {
          policeDocumentId: response.externalPoliceDocumentId,
        } as PoliceDocumentDelivery
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
        message: `Failed to update document delivery ${policeDocumentId} information for file type code ${updatePoliceDocumentDelivery.fileTypeCode}`,
      })
    }
  }

  async getPoliceDocumentSupplements(
    fileTypeCode: PoliceFileTypeCode,
    policeDocumentId: string,
  ) {
    switch (fileTypeCode) {
      case PoliceFileTypeCode.VERDICT:
        return await this.auditTrailService.audit(
          'digital-mailbox-api',
          AuditedAction.GET_VERDICT_SUPPLEMENTS,
          this.getVerdictSupplements(policeDocumentId),
          policeDocumentId,
        )
    }

    throw new BadRequestException('Police file type code not supported')
  }

  private async getVerdictSupplements(policeDocumentId: string) {
    try {
      const res = await fetch(
        `${this.config.backend.url}/api/internal/verdict/${policeDocumentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backend.accessToken}`,
          },
        },
      )
      if (res.ok) {
        const verdictSupplements = (await res.json()) as {
          serviceInformationForDefendant: InformationForDefendant[]
        }
        const { serviceInformationForDefendant } = verdictSupplements

        if (
          serviceInformationForDefendant?.length === 0 ||
          !serviceInformationForDefendant
        ) {
          return { groups: [] }
        }

        return {
          groups: [
            {
              label: 'Mikilvægar upplýsingar til dómfellda',
              items: getRulingInstructionItems(serviceInformationForDefendant),
            } as Groups,
          ],
        }
      }

      throw new BadRequestException()
    } catch (error) {
      this.logger.error(
        `Failed to retrieve verdict supplements for police document id ${policeDocumentId}`,
        error,
      )

      throw new BadRequestException('Failed to retrieve verdict supplements')
    }
  }
}
