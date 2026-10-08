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
  MessageType,
} from '@island.is/judicial-system/message'
import {
  IndictmentCaseNotificationType,
  indictmentCases,
  isSuccessfulVerdictServiceStatus,
} from '@island.is/judicial-system/types'

import {
  getOrCreateTransaction,
  queueMessagesAfterCommit,
  registerAfterCommit,
} from '../../middleware'
import {
  CaseCompletedGuard,
  CaseExistsForUpdateGuard,
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
import { VerdictOnCaseGuard } from './guards/verdictOnCase.guard'
import { DeliverResponse } from './models/deliver.response'
import { validateVerdictAppealUpdate } from './verdict.helpers'
import {
  VerdictService,
  VerdictServiceCertificateDelivery,
} from './verdict.service'
@Controller('api/internal')
@ApiTags('internal verdict')
@UseGuards(TokenGuard)
export class InternalVerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    private readonly auditTrailService: AuditTrailService,
    private readonly eventService: EventService,
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
        results: DeliverResponse,
      ) => {
        const currentVerdict = await this.verdictService.findById(
          verdict.id,
          transaction,
        )

        return {
          deliveredToPolice: results.delivered,
          verdictId: verdict.id,
          verdictCreated: verdict.created,
          externalPoliceDocumentId: currentVerdict.externalPoliceDocumentId,
          verdictHash: currentVerdict.hash,
          verdictDeliveredToPolice: new Date(),
        }
      }

      const response = await this.auditTrailService.audit(
        deliverDto.user.id,
        AuditedAction.DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT,
        this.verdictService.deliverVerdictToNationalCommissionersOffice({
          theCase,
          defendant,
          verdict,
          user: deliverDto.user,
          transaction,
        }),
        caseId,
        getDeliveredVerdictNationalCommissionersOfficeLogDetails,
      )

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

  // The police name the verdict, not the case: ExternalPoliceVerdictExistsGuard
  // resolves it by its police document id and puts the case id on the request
  // params, which is where CaseExistsForUpdateGuard reads it from - so it has
  // to run first. The case is then read under FOR UPDATE, and VerdictOnCaseGuard
  // swaps the verdict for the copy the locked case carries: the first read
  // happened before the lock, so its fields may be stale, and the service
  // status change below is decided from them. Two deliveries of the same
  // status at once both read the verdict unserved before either locks; the
  // second serializes behind the first's commit and then sees the status
  // already there, so it announces nothing twice.
  @UseGuards(
    ExternalPoliceVerdictExistsGuard,
    CaseExistsForUpdateGuard,
    VerdictOnCaseGuard,
  )
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

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    const updatedVerdict = await this.verdictService.updatePoliceDelivery(
      verdict,
      update,
      transaction,
    )

    if (
      updatedVerdict.serviceStatus &&
      updatedVerdict.serviceStatus !== verdict.serviceStatus
    ) {
      const hasDrivingLicenseSuspension =
        theCase.defendants?.some(
          (defendant) =>
            updatedVerdict.defendantId === defendant.id &&
            defendant.isDrivingLicenseSuspended,
        ) ?? false

      if (
        isSuccessfulVerdictServiceStatus(updatedVerdict.serviceStatus) &&
        hasDrivingLicenseSuspension
      ) {
        queueMessagesAfterCommit({
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId: theCase.id,
          body: {
            type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
          },
        })
      }

      // The event announces a service status the database has accepted, so
      // it is posted after the commit - which TransactionCommitInterceptor
      // does after this handler has returned - as it was when the handler
      // committed a transaction of its own. Still fire and forget: a failed
      // announcement is logged, not returned to the caller. It runs after the
      // suspension notification above has been queued; nothing depends on the
      // order between the two.
      const { serviceStatus, serviceDate } = updatedVerdict

      registerAfterCommit(() =>
        this.eventService.postEvent('VERDICT_SERVICE_STATUS', theCase, {
          Staða: getVerdictServiceStatusText(serviceStatus),
          Birt: formatDate(serviceDate, 'dd.MM.y HH:mm') ?? 'ekki skráð',
        }),
      )
    }

    return updatedVerdict
  }

  // The appeal decision is validated against the case's ruling and written to
  // the verdict the guards found on it, so the case is read under FOR UPDATE
  // and the guards after the read all decide from that locked row.
  @UseGuards(
    CaseExistsForUpdateGuard,
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
  async updateVerdictAppeal(
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

    // The transaction CaseExistsForUpdateGuard opened - see updateVerdict.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.verdictService.updateRestricted(
      verdict,
      { appealDecision: verdictAppeal.appealDecision },
      transaction,
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
