import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Patch,
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

import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { AppealVerdict, Case } from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { PoliceUpdateAppealVerdictDto } from './dto/policeUpdateAppealVerdict.dto'
import { CurrentAppealVerdict } from './guards/appealVerdict.decorator'
import { AppealVerdictExistsGuard } from './guards/appealVerdictExists.guard'
import { AppealVerdictOnCaseGuard } from './guards/appealVerdictOnCase.guard'
import { ExternalPoliceAppealVerdictExistsGuard } from './guards/externalPoliceAppealVerdictExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { AppealVerdictService } from './appealVerdict.service'

@Controller('api/internal')
@ApiTags('internal appeal verdict')
@UseGuards(TokenGuard)
export class InternalAppealVerdictController {
  constructor(
    private readonly appealVerdictService: AppealVerdictService,
    private readonly auditTrailService: AuditTrailService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    AppealVerdictExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[
        MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_VERDICT
      ]
    }/:appealVerdictId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description:
      'Delivers a COA verdict to the police centralized file service',
  })
  async deliverAppealVerdictToNationalCommissionersOffice(
    @Param('caseId') caseId: string,
    @Param('appealVerdictId') appealVerdictId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealVerdict() appealVerdict: AppealVerdict,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering appeal verdict ${appealVerdictId} to the police centralized file service for case ${caseId}`,
    )

    const transaction = await this.sequelize.transaction()

    try {
      const response = await this.auditTrailService.audit(
        deliverDto.user.id,
        AuditedAction.DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_VERDICT,
        this.appealVerdictService.deliverAppealVerdictToNationalCommissionersOffice(
          {
            theCase,
            appealVerdict,
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
        `Failed to deliver appeal verdict ${appealVerdictId} to national commissioners office for case ${caseId}`,
        { error },
      )

      throw error
    }
  }

  @UseGuards(
    ExternalPoliceAppealVerdictExistsGuard,
    CaseExistsForUpdateGuard,
    AppealVerdictOnCaseGuard,
  )
  @Patch('appeal-verdict/:policeDocumentId')
  @ApiOkResponse({
    type: AppealVerdict,
    description: 'Updates COA verdict delivery status from the police',
  })
  async updateAppealVerdict(
    @Param('policeDocumentId') policeDocumentId: string,
    @CurrentAppealVerdict() appealVerdict: AppealVerdict,
    @CurrentCase() theCase: Case,
    @Body() update: PoliceUpdateAppealVerdictDto,
  ): Promise<AppealVerdict> {
    this.logger.info(
      `Updating appeal verdict by external police document id ${policeDocumentId} of ${theCase.id}`,
    )

    // Audited at the xrd-api boundary (UPDATE_APPEAL_VERDICT), same as
    // district verdict and appeal summons police updates — do not double-audit.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealVerdictService.updatePoliceDelivery(
      appealVerdict,
      update,
      transaction,
    )
  }
}
