import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
  formatDate,
  getVerdictServiceStatusText,
} from '@island.is/judicial-system/formatters'
import {
  messageEndpoint,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseIndictmentRulingDecision,
  getDefendantServiceDate,
  getIndictmentAppealDeadline,
  IndictmentCaseNotificationType,
  indictmentCases,
  isSuccessfulVerdictServiceStatus,
} from '@island.is/judicial-system/types'

import {
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { CurrentDefendant, DefendantExistsGuard } from '../defendant'
import { DefendantNationalIdExistsGuard } from '../defendant/guards/defendantNationalIdExists.guard'
import { EventService } from '../event'
import { Case, Defendant, Verdict } from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { PoliceUpdateVerdictDto } from './dto/policeUpdateVerdict.dto'
import { ExternalPoliceVerdictExistsGuard } from './guards/ExternalPoliceVerdictExists.guard'
import { CurrentVerdict } from './guards/verdict.decorator'
import { VerdictExistsGuard } from './guards/verdictExists.guard'
import { DeliverResponse } from './models/deliver.response'
import {
  VerdictService,
  VerdictServiceCertificateDelivery,
} from './verdict.service'

const validateVerdictAppealUpdate = ({
  caseId,
  indictmentRulingDecision,
  rulingDate,
  verdict,
}: {
  caseId: string
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: Date
  verdict: Verdict
}) => {
  if (!rulingDate) {
    throw new BadRequestException(
      `Cannot register appeal – No ruling date has been set for case ${caseId}`,
    )
  }

  const baseDate = getDefendantServiceDate({
    verdict,
    fallbackDate: rulingDate,
  })

  // this can only be thrown if service date is not set
  if (!baseDate) {
    throw new BadRequestException(
      `Cannot register appeal – Service date not set for case ${caseId}`,
    )
  }
  const { deadlineDate, isDeadlineExpired } = getIndictmentAppealDeadline({
    baseDate: new Date(baseDate),
    isFine: indictmentRulingDecision === CaseIndictmentRulingDecision.FINE,
  })
  if (isDeadlineExpired) {
    throw new BadRequestException(
      `Appeal deadline has passed for case ${caseId}. Deadline was ${deadlineDate.toISOString()}`,
    )
  }
}

@Controller('api/internal')
@ApiTags('internal verdict')
@UseGuards(TokenGuard)
export class InternalVerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    private readonly auditTrailService: AuditTrailService,
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseCompletedGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
  )
  @Post([
    `case/:caseId/${
      messageEndpoint[
        MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT
      ]
    }/:defendantId`,
  ])
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a verdict to the police centralized file service',
  })
  async deliverVerdictToNationalCommissionersOffice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentVerdict() verdict: Verdict,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering verdict ${verdict.id} pdf to the police centralized file service for defendant ${defendantId} of case ${caseId}`,
    )

    // TODO: We should probably filter out defendants without national id when posting events to queue
    //       This is not an error
    if (defendant.noNationalId) {
      throw new BadRequestException(
        `National id is required for ${defendant.id} when delivering verdict to national commissioners office`,
      )
    }

    const transaction = await this.sequelize.transaction()

    try {
      // callback function to fetch the updated verdict fields after delivering verdict to police
      const getDeliveredVerdictNationalCommissionersOfficeLogDetails = async (
        results?: DeliverResponse,
      ) => {
        const currentVerdict = await this.verdictService.findById(
          verdict.id,
          transaction,
        )

        return {
          deliveredToPolice: Boolean(results?.delivered),
          verdictId: verdict.id,
          externalPoliceDocumentId: currentVerdict.externalPoliceDocumentId,
          verdictHash: currentVerdict.hash,
          verdictDeliveredToPolice: new Date(),
        }
      }

      const response = await this.auditTrailService.runAndAuditRequest({
        userId: deliverDto.user.id,
        actionType:
          AuditedAction.DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT,
        action: this.verdictService.deliverVerdictToNationalCommissionersOffice,
        actionProps: {
          theCase,
          defendant,
          verdict,
          user: deliverDto.user,
          transaction,
        },
        auditedResult: caseId,
        getAuditDetails:
          getDeliveredVerdictNationalCommissionersOfficeLogDetails,
      })

      await transaction.commit()

      return response
    } catch (error) {
      this.logger.error(
        `Failed to deliver verdict ${verdict.id} to national commissioners office for defendant ${defendantId} of case ${caseId}`,
        { error },
      )

      await transaction.rollback()

      throw error
    }
  }

  @UseGuards(ExternalPoliceVerdictExistsGuard, CaseExistsGuard)
  @Patch('verdict/:policeDocumentId')
  async updateVerdict(
    @Param('policeDocumentId') policeDocumentId: string,
    @CurrentVerdict() verdict: Verdict,
    @CurrentCase() theCase: Case,
    @Body() update: PoliceUpdateVerdictDto,
  ): Promise<Verdict> {
    this.logger.info(
      `Updating verdict by external police document id ${policeDocumentId} of ${theCase.id}`,
    )

    const updatedVerdict = await this.sequelize.transaction(
      async (transaction) =>
        this.verdictService.updatePoliceDelivery(verdict, update, transaction),
    )

    if (
      updatedVerdict.serviceStatus &&
      updatedVerdict.serviceStatus !== verdict.serviceStatus
    ) {
      // TODO: check if "suspension" is checked
      if (isSuccessfulVerdictServiceStatus(updatedVerdict.serviceStatus)) {
        this.messageService.sendMessagesToQueue([
          {
            type: MessageType.INDICTMENT_CASE_NOTIFICATION,
            caseId: theCase.id,
            body: {
              type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENDED,
            },
          },
        ])
      }

      this.eventService.postEvent('VERDICT_SERVICE_STATUS', theCase, false, {
        Staða: getVerdictServiceStatusText(updatedVerdict.serviceStatus),
        Birt: formatDate(updatedVerdict.serviceDate, 'Pp') ?? 'ekki skráð',
      })
    }

    return updatedVerdict
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseCompletedGuard,
    DefendantNationalIdExistsGuard,
    VerdictExistsGuard,
  )
  @Patch('/case/:caseId/defendant/:defendantNationalId/verdict-appeal')
  @ApiOkResponse({
    type: Verdict,
    description: 'Updates defendant verdict appeal decision',
  })
  updateVerdictAppeal(
    @Param('caseId') caseId: string,
    @Param('defendantNationalId') _: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentVerdict() verdict: Verdict,
    @Body() verdictAppeal: InternalUpdateVerdictDto,
  ): Promise<Verdict> {
    this.logger.debug(
      `Updating verdict appeal for defendant ${defendant.id} in case ${caseId}`,
    )

    validateVerdictAppealUpdate({
      caseId: theCase.id,
      indictmentRulingDecision: theCase.indictmentRulingDecision,
      rulingDate: theCase.rulingDate,
      verdict,
    })

    return this.sequelize.transaction(async (transaction) =>
      this.verdictService.updateRestricted(
        verdict,
        { appealDecision: verdictAppeal.appealDecision },
        transaction,
      ),
    )
  }

  @UseGuards(ExternalPoliceVerdictExistsGuard)
  @Get('verdict/:policeDocumentId')
  async getVerdictSupplements(
    @Param('policeDocumentId') policeDocumentId: string,
  ): Promise<Pick<Verdict, 'serviceInformationForDefendant'>> {
    this.logger.debug(
      `Get verdict supplements for police document id ${policeDocumentId}`,
    )

    // Todo: Use CurrentVerdict decorator to avoid querying for the verdict again
    const verdict = await this.verdictService.findByExternalPoliceDocumentId(
      policeDocumentId,
    )

    return {
      serviceInformationForDefendant: verdict.serviceInformationForDefendant,
    }
  }

  @ApiOkResponse({
    description:
      'Delivers a service certificate to the police for all defendants where appeal deadline is expired',
  })
  @Post('verdict/deliverVerdictServiceCertificates')
  async deliverVerdictServiceCertificatesToPolice(): Promise<
    VerdictServiceCertificateDelivery[]
  > {
    this.logger.debug(
      `Delivering verdict service certificates pdf to police for all verdicts where appeal decision deadline has passed`,
    )

    const delivered = await this.sequelize.transaction((transaction) =>
      this.verdictService.deliverVerdictServiceCertificatesToPolice(
        transaction,
      ),
    )

    await this.eventService.postDailyVerdictServiceDeliveryEvent(delivered)

    return delivered
  }
}
