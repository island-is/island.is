import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseHasExistedGuard, CaseTypeGuard, CurrentCase } from '../case'
import {
  CivilClaimantExistsGuard,
  CurrentCivilClaimant,
  CurrentDefendant,
  SplitDefendantExistsGuard,
} from '../defendant'
import { Case, CivilClaimant, Defendant } from '../repository'
import { SubpoenaExistsGuard } from '../subpoena'
import { CaseNotificationDto } from './dto/caseNotification.dto'
import { CivilClaimantNotificationDto } from './dto/civilClaimantNotification.dto'
import { DefendantNotificationDto } from './dto/defendantNotification.dto'
import { IndictmentCaseNotificationDto } from './dto/indictmentCaseNotification.dto'
import { InstitutionNotificationDto } from './dto/institutionNotification.dto'
import {
  EventNotificationDispatchDto,
  NotificationDispatchDto,
} from './dto/notificationDispatch.dto'
import { SubpoenaNotificationDto } from './dto/subpoenaNotification.dto'
import { DeliverResponse } from './models/deliver.response'
import { CaseNotificationService } from './services/caseNotification/caseNotification.service'
import { CivilClaimantNotificationService } from './services/civilClaimantNotification/civilClaimantNotification.service'
import { DefendantNotificationService } from './services/defendantNotification/defendantNotification.service'
import { IndictmentCaseNotificationService } from './services/indictmentCaseNotification/indictmentCaseNotification.service'
import { InstitutionNotificationService } from './services/institutionNotification/institutionNotification.service'
import { SubpoenaNotificationService } from './services/subpoenaNotification/subpoenaNotification.service'
import { NotificationDispatchService } from './notificationDispatch.service'

@Controller('api/internal')
@ApiTags('internal notifications')
@UseGuards(TokenGuard)
export class InternalNotificationController {
  constructor(
    private readonly caseNotificationService: CaseNotificationService,
    private readonly notificationDispatchService: NotificationDispatchService,
    private readonly institutionNotificationService: InstitutionNotificationService,
    private readonly subpoenaNotificationService: SubpoenaNotificationService,
    private readonly defendantNotificationService: DefendantNotificationService,
    private readonly civilClaimantNotificationService: CivilClaimantNotificationService,
    private readonly indictmentCaseNotificationService: IndictmentCaseNotificationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post(`case/:caseId/${messageEndpoint[MessageType.NOTIFICATION]}`)
  @UseGuards(CaseHasExistedGuard)
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Sends a case notification for an existing case',
  })
  sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() notificationDto: CaseNotificationDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Sending ${notificationDto.type} case notification for case ${caseId}`,
    )

    return this.caseNotificationService.sendCaseNotification(
      notificationDto.type,
      theCase,
      notificationDto.user,
      notificationDto.userDescriptor,
    )
  }

  @Post(
    `case/:caseId/${messageEndpoint[MessageType.INDICTMENT_CASE_NOTIFICATION]}`,
  )
  @UseGuards(CaseHasExistedGuard, new CaseTypeGuard(indictmentCases))
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Sends a case notification for an existing indictment case',
  })
  sendIndictmentCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() notificationDto: IndictmentCaseNotificationDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Sending ${notificationDto.type} indictment case notification for case ${caseId}`,
    )

    return this.indictmentCaseNotificationService.sendIndictmentCaseNotification(
      notificationDto.type,
      theCase,
      notificationDto.userDescriptor,
    )
  }

  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.SUBPOENA_NOTIFICATION]
    }/:defendantId/:subpoenaId`,
  )
  @UseGuards(
    CaseHasExistedGuard,
    SplitDefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Sends a subpoena notification for an existing subpoena',
  })
  sendSubpoenaNotification(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @Body() notificationDto: SubpoenaNotificationDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Sending ${notificationDto.type} subpoena notification for subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
    )

    return this.subpoenaNotificationService.sendSubpoenaNotification(
      notificationDto.type,
      theCase,
    )
  }

  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.DEFENDANT_NOTIFICATION]
    }/:defendantId`,
  )
  @UseGuards(CaseHasExistedGuard, SplitDefendantExistsGuard)
  @ApiCreatedResponse({
    type: DeliverResponse,
    description:
      'Sends defendant related notifications for an existing defendant',
  })
  sendDefendantNotification(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() notificationDto: DefendantNotificationDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Sending ${notificationDto.type} defendant notification for defendant ${defendantId} and case ${caseId}`,
    )

    return this.defendantNotificationService.sendDefendantNotification(
      notificationDto.type,
      theCase,
      defendant,
      notificationDto.user,
    )
  }

  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.CIVIL_CLAIMANT_NOTIFICATION]
    }/:civilClaimantId`,
  )
  @UseGuards(CaseHasExistedGuard, CivilClaimantExistsGuard)
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Sends civil claimant related notifications',
  })
  sendCivilClaimantNotification(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @CurrentCase() theCase: Case,
    @CurrentCivilClaimant() civilClaimant: CivilClaimant,
    @Body() notificationDto: CivilClaimantNotificationDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Sending ${notificationDto.type} notification for civil claimant ${civilClaimantId} and case ${caseId}`,
    )

    return this.civilClaimantNotificationService.sendCivilClaimantNotification(
      notificationDto.type,
      civilClaimant,
      theCase,
    )
  }

  @Post(messageEndpoint[MessageType.INSTITUTION_NOTIFICATION])
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Sends an institution notification',
  })
  sendInstitutionNotification(
    @Body() notificationDto: InstitutionNotificationDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Sending ${notificationDto.type} notification`)

    return this.institutionNotificationService.sendNotification(
      notificationDto.type,
      notificationDto.prosecutorsOfficeId,
    )
  }

  @Post(
    `case/:caseId/${messageEndpoint[MessageType.EVENT_NOTIFICATION_DISPATCH]}`,
  )
  @UseGuards(CaseHasExistedGuard)
  @ApiCreatedResponse({
    type: DeliverResponse,
    description:
      'Dispatches notifications in response to events logged in event log',
  })
  dispatchEventNotification(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() notificationDto: EventNotificationDispatchDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Dispatching ${notificationDto.type} event notification for case ${caseId}`,
    )

    return this.notificationDispatchService.dispatchEventNotification(
      notificationDto.type,
      theCase,
      notificationDto.userDescriptor,
    )
  }

  @Post(messageEndpoint[MessageType.NOTIFICATION_DISPATCH])
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Dispatches notifications',
  })
  dispatchNotification(
    @Body() notificationDto: NotificationDispatchDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Dispatching ${notificationDto.type} notification`)

    return this.notificationDispatchService.dispatchNotification(
      notificationDto.type,
    )
  }
}
