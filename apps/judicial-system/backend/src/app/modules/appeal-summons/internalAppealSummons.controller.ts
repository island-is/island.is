import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseTypeGuard, CurrentCase } from '../case'
import {
  AppealSummons,
  AppealSummonsRepositoryService,
  AppealSummonsServiceRecipient,
  Case,
} from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { CurrentAppealSummons } from './guards/appealSummons.decorator'
import { AppealSummonsExistsGuard } from './guards/appealSummonsExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { AppealSummonsService } from './appealSummons.service'

@Controller('api/internal')
@ApiTags('internal appeal summons')
@UseGuards(TokenGuard)
export class InternalAppealSummonsController {
  constructor(
    private readonly appealSummonsService: AppealSummonsService,
    private readonly appealSummonsRepositoryService: AppealSummonsRepositoryService,
    private readonly auditTrailService: AuditTrailService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    AppealSummonsExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[
        MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_SUMMONS
      ]
    }/:appealSummonsId/:serviceId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description:
      'Delivers an appeal summons to the police centralized file service for one recipient',
  })
  async deliverAppealSummonsToNationalCommissionersOffice(
    @Param('caseId') caseId: string,
    @Param('appealSummonsId') appealSummonsId: string,
    @Param('serviceId') serviceId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealSummons() summons: AppealSummons,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering appeal summons ${appealSummonsId} to the police centralized file service for service ${serviceId} of case ${caseId}`,
    )

    const service =
      summons.services?.find((row) => row.id === serviceId) ??
      (await this.appealSummonsRepositoryService.findServiceRecipientById(
        serviceId,
        appealSummonsId,
      ))

    if (!service) {
      throw new NotFoundException(
        `Appeal summons service ${serviceId} not found for summons ${appealSummonsId}`,
      )
    }

    const transaction = await this.sequelize.transaction()

    try {
      const response = await this.auditTrailService.audit(
        deliverDto.user.id,
        AuditedAction.DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_SUMMONS,
        this.appealSummonsService.deliverAppealSummonsToNationalCommissionersOffice(
          {
            theCase,
            summons,
            service: service as AppealSummonsServiceRecipient,
            user: deliverDto.user,
            transaction,
          },
        ),
        caseId,
      )

      await transaction.commit()

      return response
    } catch (error) {
      await transaction.rollback()

      if (error instanceof BadRequestException) {
        throw error
      }

      this.logger.error(
        `Failed to deliver appeal summons ${appealSummonsId} to national commissioners office for service ${serviceId} of case ${caseId}`,
        { error },
      )

      throw error
    }
  }
}
