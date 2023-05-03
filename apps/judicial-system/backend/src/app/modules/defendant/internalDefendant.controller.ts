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

import { Case, CaseExistsGuard, CaseTypeGuard, CurrentCase } from '../case'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { DeliverDefendantToCourtDto } from './dto/deliverDefendantToCourt.dto'
import { DeliverResponse } from './models/deliver.response'
import { Defendant } from './models/defendant.model'
import { DefendantService } from './defendant.service'

@Controller('api/internal/case/:caseId/defendant/:defendantId')
@ApiTags('internal defendants')
@UseGuards(
  TokenGuard,
  CaseExistsGuard,
  new CaseTypeGuard([...restrictionCases, ...investigationCases]),
  DefendantExistsGuard,
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
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() deliverDefendantToCourtDto: DeliverDefendantToCourtDto,
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
}
