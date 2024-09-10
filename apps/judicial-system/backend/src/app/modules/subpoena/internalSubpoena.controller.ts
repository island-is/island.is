import { Base64 } from 'js-base64'

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
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
import { DateType, indictmentCases } from '@island.is/judicial-system/types'

import { CaseTypeGuard, CurrentCase, PdfService } from '../case'
import { CaseExistsGuard } from '../case/guards/caseExists.guard'
import { Case } from '../case/models/case.model'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { Defendant } from '../defendant/models/defendant.model'
import { DeliverDto } from './dto/deliver.dto'
import { DeliverResponse } from './models/deliver.response'
import { Subpoena } from './models/subpoena.model'
import { SubpoenaService } from './subpoena.service'

@Controller('api/internal/')
@ApiTags('internal subpoenas')
//@UseGuards(TokenGuard)
export class InternalSubpoenaController {
  constructor(
    private readonly subpoenaService: SubpoenaService,
    private readonly pdfService: PdfService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('subpoena/:subpoenaId')
  async getSubpoena(
    @Param('subpoenaId') subpoenaId: string,
  ): Promise<Subpoena | null> {
    this.logger.debug(`Getting subpoena by subpoena id ${subpoenaId}`)

    return this.subpoenaService.getSubpoena(subpoenaId)
  }

  @Post('subpoena/:caseId/:defendantId')
  @UseGuards(CaseExistsGuard, DefendantExistsGuard)
  async createSubpoena(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
  ): Promise<Subpoena> {
    this.logger.debug(`Creating subpoena for defendant ${defendantId}`)

    return this.subpoenaService.createSubpoena(defendant)
  }

  @Patch('subpoena/:subpoenaId')
  async updateSubpoena(
    @Param('subpoenaId') subpoenaId: string,
    @Body() subpoena: Subpoena,
  ): Promise<Subpoena> {
    this.logger.debug(`Updating subpoena by subpoena id ${subpoenaId}`)

    return this.subpoenaService.updateSubpoena(subpoena)
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.DELIVERY_TO_POLICE_SUBPOENA]
    }/:defendantId`,
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
      `Delivering subpoena ${caseId} to police for defendant ${defendantId}`,
    )

    const courtDate = theCase.dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.COURT_DATE,
    )

    const delivered = await this.pdfService
      .getSubpoenaPdf(
        theCase,
        defendant,
        courtDate?.date,
        courtDate?.location,
        defendant.subpoenaType,
      )
      .then(async (pdf) => {
        return this.subpoenaService.deliverSubpoenaToPolice(
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
