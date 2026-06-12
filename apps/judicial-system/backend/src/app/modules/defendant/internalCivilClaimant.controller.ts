import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseTypeGuard, CurrentCase } from '../case'
import { Case, CivilClaimant } from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { CurrentCivilClaimant } from './guards/civilClaimaint.decorator'
import { CivilClaimantExistsGuard } from './guards/civilClaimantExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { CivilClaimantService } from './civilClaimant.service'

@Controller('api/internal/case/:caseId')
@ApiTags('internal civil claimants')
@UseGuards(TokenGuard, CaseExistsGuard)
export class InternalCivilClaimantController {
  constructor(
    private readonly civilClaimantService: CivilClaimantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(new CaseTypeGuard(indictmentCases), CivilClaimantExistsGuard)
  @Post(
    `${
      messageEndpoint[MessageType.DELIVERY_TO_COURT_INDICTMENT_CIVIL_CLAIMANT]
    }/:civilClaimantId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers indictment case civil claimant info to court',
  })
  deliverIndictmentCivilClaimantToCourt(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @CurrentCase() theCase: Case,
    @CurrentCivilClaimant() civilClaimant: CivilClaimant,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering civil claimant info for civil claimant ${civilClaimantId} of case ${caseId} to court`,
    )

    return this.civilClaimantService.deliverIndictmentCivilClaimantToCourt(
      theCase,
      civilClaimant,
      deliverDto.user,
    )
  }
}
