import Base64 from 'js-base64'

import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  Case,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
  PdfService,
} from '../case'
import { DeliverDto } from '../case/dto/deliver.dto'
import { DeliverDefendantToCourtDto } from './dto/deliverDefendantToCourt.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { Defendant } from './models/defendant.model'
import { DeliverResponse } from './models/deliver.response'
import { Subpoena } from './models/subpoena.model'
import { DefendantService } from './defendant.service'

@Controller('api/internal/case/:caseId')
@ApiTags('internal defendants')
@UseGuards(TokenGuard, CaseExistsGuard)
export class InternalDefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    private readonly pdfService: PdfService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(DefendantExistsGuard)
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

  @Patch('defense/:defendantNationalId')
  @ApiOkResponse({
    type: Defendant,
    description: 'Assigns defense choice to defendant',
  })
  async assignDefender(
    @Param('caseId') caseId: string,
    @Param('defendantNationalId') defendantNationalId: string,
    @CurrentCase() theCase: Case,
    @Body() updatedDefendantChoice: UpdateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Assigning defense choice to defendant in case ${caseId}`)

    const updatedDefendant = await this.defendantService.updateByNationalId(
      theCase.id,
      defendantNationalId,
      updatedDefendantChoice,
    )

    return updatedDefendant
  }

  async getSubpoenas(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
  ): Promise<Subpoena[]> {
    this.logger.debug(
      `Getting the subpoena info for defendant ${defendantId} of case ${caseId}`,
    )

    return this.defendantService.getSubpoenas(defendant, theCase)
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
  )
  @Post(
    `${messageEndpoint[MessageType.DELIVERY_TO_POLICE_SUBPOENA]}/:defendantId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a subpoena to police',
  })
  async deliverSubpoenaToPolice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering subpoena ${caseId} to police for defendant ${defendant}`,
    )
    this.logger.debug('caseId', caseId)
    this.logger.debug('defendantId', defendantId)

    const delivered = await this.pdfService
      .getSubpoenaPdf(
        theCase,
        defendant,
        new Date(),
        'Reykjavík',
        defendant.subpoenaType,
      )
      .then(async (pdf) => {
        return this.defendantService.deliverSubpoenaToPolice(
          theCase,
          defendant,
          Base64.btoa(pdf.toString('binary')),
          deliverDto.user,
        )
      })
      .catch((error) => {
        this.logger.error('Error generating subpoena pdf', error)
        throw error
      })

    return delivered
  }
}
