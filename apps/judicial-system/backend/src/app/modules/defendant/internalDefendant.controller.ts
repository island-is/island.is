import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { User } from '../user'
import { Case, CaseExistsGuard, CaseTypeGuard, CurrentCase } from '../case'
import { CurrentUser } from './guards/user.decorator'
import { CurrentDefendant } from './guards/defendant.decorator'
import { UserExistsGuard } from './guards/userExistsGuard'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { Defendant } from './models/defendant.model'
import { DefendantService } from './defendant.service'
import { DeliverDefendantToCourtDto } from './dto/deliverDefendantToCourt.dto'

@Controller('api/internal/case/:caseId/defendant/:defendantId')
@ApiTags('internal defendants')
@UseGuards(
  TokenGuard,
  CaseExistsGuard,
  new CaseTypeGuard([...restrictionCases, ...investigationCases]),
  DefendantExistsGuard,
  UserExistsGuard,
)
export class InternalDefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('deliverToCourt')
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Delivers a case file to court',
  })
  deliverDefendantToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Body() _: DeliverDefendantToCourtDto,
    @CurrentUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering defendant ${defendantId} of case ${caseId} to court`,
    )

    return this.defendantService.deliverDefendantToCourt(
      theCase,
      defendant,
      user,
    )
  }
}
