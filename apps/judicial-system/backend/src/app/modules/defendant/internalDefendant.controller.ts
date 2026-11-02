import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { Case, Defendant } from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { InternalUpdateDefendantDto } from './dto/internalUpdateDefendant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { DefendantNationalIdExistsGuard } from './guards/defendantNationalIdExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { DefendantService } from './defendant.service'

// Only the token guard is shared by every route here. The exists guard is
// per route, because the routes read the case for different reasons: the
// three deliver routes call the court system with no transaction, and must
// read the case with the plain CaseExistsGuard - a FOR UPDATE read there
// would hold the case lock across external I/O. The update route changes a
// defendant from the case the guard loaded, so it reads the case under FOR
// UPDATE with CaseExistsForUpdateGuard and serializes on the case row with
// every other converted route on the case. CaseTypeGuard and
// the defendant guards decide from request.case, so they follow whichever
// exists guard a route has.
@Controller('api/internal/case/:caseId')
@ApiTags('internal defendants')
@UseGuards(TokenGuard)
export class InternalDefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    DefendantExistsGuard,
  )
  @Post(
    `${messageEndpoint[MessageType.DELIVERY_TO_COURT_DEFENDANT]}/:defendantId`,
  )
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Delivers a case file to court',
  })
  deliverDefendantToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() deliverDefendantToCourtDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering defendant ${defendantId} of case ${caseId} to court`,
    )

    return this.defendantService.deliverDefendantToCourt(
      theCase,
      defendant,
      deliverDefendantToCourtDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    DefendantExistsGuard,
  )
  @Post(
    `${
      messageEndpoint[MessageType.DELIVERY_TO_COURT_REQUEST_DEFENDANT]
    }/:defendantId`,
  )
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Delivers a request case defendant to court via robot email',
  })
  deliverRequestDefendantToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering defendant ${defendantId} of request case ${caseId} to court`,
    )

    return this.defendantService.deliverRequestDefendantToCourt(
      theCase,
      defendant,
      deliverDto.user,
    )
  }

  // DefendantNationalIdExistsGuard finds the defendant on request.case, so
  // the handler changes the defendant row as the locked case carries it.
  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantNationalIdExistsGuard,
  )
  @Patch('defense/:defendantNationalId')
  @ApiOkResponse({
    type: Defendant,
    description: 'Updates defendant information by case and national id',
  })
  async updateDefendant(
    @Param('caseId') caseId: string,
    @Param('defendantNationalId') _: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() updatedDefendantChoice: InternalUpdateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Updating defendant info for ${caseId}`)

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.defendantService.updateRestricted(
      theCase,
      defendant,
      updatedDefendantChoice,
      transaction,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
  )
  @Post(
    `${
      messageEndpoint[MessageType.DELIVERY_TO_COURT_INDICTMENT_DEFENDANT]
    }/:defendantId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers indictment case defendant info to court',
  })
  deliverIndictmentDefendantToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering defendant info for defendant ${defendantId} of case ${caseId} to court`,
    )

    return this.defendantService.deliverIndictmentDefendantToCourt(
      theCase,
      defendant,
      deliverDto.user,
    )
  }
}
