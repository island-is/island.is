import { Response } from 'express'

import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { getVerdictServiceStatusText } from '@island.is/judicial-system/formatters'
import { indictmentCases } from '@island.is/judicial-system/types'
import { type User } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prisonSystemStaffRule,
  publicProsecutorStaffRule,
} from '../../guards'
import {
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
  PdfService,
} from '../case'
import { CurrentDefendant, DefendantExistsGuard } from '../defendant'
import { EventService } from '../event'
import { LawyerRegistryService } from '../lawyer-registry/lawyerRegistry.service'
import { Case, Defendant, Verdict } from '../repository'
import { CreateVerdictDto } from './dto/createVerdict.dto'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { CurrentVerdict } from './guards/verdict.decorator'
import { VerdictExistsGuard } from './guards/verdictExists.guard'
import { VerdictService } from './verdict.service'

@Controller('api/case/:caseId')
@ApiTags('verdicts')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
)
export class VerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    private readonly lawyerRegistryService: LawyerRegistryService,
    private readonly pdfService: PdfService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseWriteGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post('verdicts')
  @ApiOkResponse({
    type: Verdict,
    description: 'Create verdicts for relevant defendants',
  })
  async createVerdicts(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() verdictsToCreate: CreateVerdictDto[],
  ): Promise<Verdict[]> {
    this.logger.debug(`Creating verdicts for defendants in ${caseId}`)

    return this.verdictService.createVerdicts(
      caseId,
      verdictsToCreate,
      theCase.defendants,
    )
  }

  @UseGuards(
    CaseWriteGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
    CaseCompletedGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
  )
  @Patch('defendant/:defendantId/verdict')
  @ApiOkResponse({
    type: Verdict,
    description: 'Updates a verdict',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentVerdict() verdict: Verdict,
    @Body() verdictToUpdate: UpdateVerdictDto,
  ): Promise<Verdict> {
    this.logger.debug(
      `Updating verdict for ${verdict.id} of ${defendantId} in ${caseId}`,
    )

    return this.verdictService.update(
      verdict,
      verdictToUpdate,
      theCase.rulingDate,
    )
  }

  @UseGuards(
    CaseReadGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
    CaseCompletedGuard,
  )
  @RolesRules(publicProsecutorStaffRule, prisonSystemStaffRule)
  @Get('defendant/:defendantId/verdict/serviceCertificate')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets the verdict service certificate for a given defendant as a pdf document',
  })
  async getServiceCertificatePdf(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentVerdict() verdict: Verdict,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting verdict service certificate for defendant ${defendantId} of case ${caseId} as a pdf document`,
    )

    const deliveredToDefender = verdict.deliveredToDefenderNationalId
      ? await this.lawyerRegistryService.getByNationalId(
          verdict.deliveredToDefenderNationalId,
        )
      : undefined

    const pdf = await this.pdfService.getVerdictServiceCertificatePdf(
      theCase,
      defendant,
      verdict,
      deliveredToDefender?.name ?? defendant.defenderName,
    )

    res.end(pdf)
  }

  @UseGuards(
    CaseReadGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
    CaseCompletedGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
  )
  @Get('defendant/:defendantId/verdict')
  @ApiOkResponse({
    type: Verdict,
    description: 'Gets verdict and fetches the current state from the police',
  })
  async getVerdict(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentVerdict() verdict: Verdict,
    @CurrentHttpUser() user: User,
  ): Promise<Verdict> {
    this.logger.debug(
      `Get verdict for ${verdict.id} of ${defendantId} in ${caseId}`,
    )
    const currentVerdict = await this.verdictService.getAndSyncVerdict(
      verdict,
      user,
    )

    if (
      currentVerdict.serviceStatus &&
      currentVerdict.serviceStatus !== verdict.serviceStatus
    ) {
      this.eventService.postEvent('VERDICT_SERVICE_STATUS', theCase, false, {
        Staða: getVerdictServiceStatusText(currentVerdict.serviceStatus),
      })
    }

    return currentVerdict
  }

  @UseGuards(CaseWriteGuard, CaseCompletedGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post('deliverVerdict')
  @ApiOkResponse({
    description: 'Delivers verdict for all defendants in a case',
  })
  async deliverCaseVerdict(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<{ queued: boolean }> {
    this.logger.debug(
      `Deliver case ${caseId} verdict to all affected defendants`,
    )

    return await this.verdictService.addMessagesForCaseVerdictDeliveryToQueue(
      theCase,
      user,
    )
  }
}
