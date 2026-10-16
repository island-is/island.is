import { Response } from 'express'
import { Sequelize } from 'sequelize-typescript'

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
import { InjectConnection } from '@nestjs/sequelize'
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
  defenderRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prisonSystemStaffRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseCompletedGuard,
  CaseExistsForUpdateGuard,
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

// The three mutating routes decide against the case row they read, and the
// verdicts on it: createVerdicts upserts from the defendants' latest verdicts,
// update from the verdict the guards found there, deliverCaseVerdict from every
// defendant's service requirement. Each of them reads the case under FOR UPDATE
// through CaseExistsForUpdateGuard, so the decision is made against a row no
// one else can change until the request's transaction commits.
//
// That guard cannot sit at class level: getVerdict calls the police inside a
// transaction of its own, and the service certificate route only reads, so
// both keep the plain CaseExistsGuard - a lock held across an external call,
// or taken for a read, is exactly what the locking guard must not do. Every
// route therefore lists its own exists guard first, and CaseTypeGuard moves
// with it: it decides from request.case, so it has to follow whichever guard
// put the case there.
//
// RolesGuard stays at class level, ahead of the locking read. It can, because
// every rule on this controller is a bare user role with no canActivate: none
// of them reads request.case, so a caller a route has no rule for is turned
// away before any case row is locked. verdictRolesRules.spec.ts pins the
// assumption, so a rule that starts reading the case cannot silently reopen
// the exposure.
@Controller('api/case/:caseId')
@ApiTags('verdicts')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class VerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    private readonly lawyerRegistryService: LawyerRegistryService,
    private readonly pdfService: PdfService,
    private readonly eventService: EventService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
  )
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

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.verdictService.createVerdicts(
      caseId,
      verdictsToCreate,
      theCase.defendants ?? [],
      transaction,
    )
  }

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
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

    // The transaction CaseExistsForUpdateGuard opened - see createVerdicts.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.verdictService.update(
      verdict,
      verdictToUpdate,
      transaction,
      theCase,
      defendantId,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
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

  // Not a candidate for the guard-owned transaction: the sync below asks the
  // police for the document's status inside the transaction, and a FOR UPDATE
  // lock on the case row must not be held across an external call. The plain
  // CaseExistsGuard and a transaction of the handler's own stay.
  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
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
    prosecutorRule,
    prosecutorRepresentativeRule,
    defenderRule,
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
    const currentVerdict = await this.sequelize.transaction((transaction) =>
      this.verdictService.getAndSyncVerdict(verdict, transaction, user),
    )

    if (
      currentVerdict.serviceStatus &&
      currentVerdict.serviceStatus !== verdict.serviceStatus
    ) {
      this.eventService.postEvent('VERDICT_SERVICE_STATUS', theCase, {
        Staða: getVerdictServiceStatusText(currentVerdict.serviceStatus),
      })
    }

    return currentVerdict
  }

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
    CaseCompletedGuard,
  )
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

    // The transaction CaseExistsForUpdateGuard opened - see createVerdicts.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.verdictService.addMessagesForCaseVerdictDeliveryToQueue(
      theCase,
      user,
      transaction,
    )
  }
}
