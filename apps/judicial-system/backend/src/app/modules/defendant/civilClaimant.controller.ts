import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Delete,
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

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases, type User } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { Case, CivilClaimant } from '../repository'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'
import { CurrentCivilClaimant } from './guards/civilClaimaint.decorator'
import { CivilClaimantExistsGuard } from './guards/civilClaimantExists.guard'
import {
  courtOfAppealsAssistantUpdateCivilClaimantRule,
  courtOfAppealsJudgeUpdateCivilClaimantRule,
  courtOfAppealsRegistrarUpdateCivilClaimantRule,
} from './guards/rolesRules'
import { DeleteCivilClaimantResponse } from './models/deleteCivilClaimant.response'
import { CivilClaimantService } from './civilClaimant.service'

// Every route here changes the case's civil claimants, and each decides what
// to change from the case the guard loaded: update narrows the claimant's
// defendants to the ones its police case numbers still reach and branches on
// whether the case is at court and on its verdict appeal, delete removes the
// claimant the guard found on the case. CaseExistsForUpdateGuard reads the
// case under FOR UPDATE in the request's transaction, so two of these
// requests on one case serialize on the case row and the second sees the
// first's commit - and so do the defendant and the converted case routes,
// which lock the same row.
//
// RolesGuard runs first, ahead of the guard that takes the write lock. It
// can, because every rule on these routes decides on the user alone - the
// court of appeals rules are field rules, which read the body, not the case -
// and none has a canActivate: a caller this controller has no rule for is
// turned away before any case row is locked. civilClaimantRolesRules.spec.ts
// pins that assumption, so a rule that starts reading the case cannot
// silently reopen the exposure.
//
// The guards after the locking read all decide from request.case and so see
// the locked row - including CivilClaimantExistsGuard on the routes that name
// a claimant.
@Controller('api/case/:caseId/civilClaimant')
@ApiTags('civilClaimants')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsForUpdateGuard,
  new CaseTypeGuard(indictmentCases),
  CaseWriteGuard,
)
export class CivilClaimantController {
  constructor(
    private readonly civilClaimantService: CivilClaimantService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: CivilClaimant,
    description: 'Civil claimant created',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<CivilClaimant> {
    this.logger.debug(`Creating a new civil claimant for case ${caseId}`)

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.civilClaimantService.create(theCase, transaction)
  }

  @UseGuards(CivilClaimantExistsGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    // Field rules, unlike the role rules above: this court settles the appeal
    // proceeding's advocate and nothing else on the claimant.
    courtOfAppealsJudgeUpdateCivilClaimantRule,
    courtOfAppealsRegistrarUpdateCivilClaimantRule,
    courtOfAppealsAssistantUpdateCivilClaimantRule,
  )
  @Patch(':civilClaimantId')
  @ApiOkResponse({
    type: CivilClaimant,
    description: 'Civil claimant updated',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @CurrentCase() theCase: Case,
    @CurrentHttpUser() user: User,
    @CurrentCivilClaimant() civilClaimant: CivilClaimant,
    @Body() updateCivilClaimantDto: UpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    this.logger.debug(
      `Updating civil claimant ${civilClaimantId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.civilClaimantService.update(
      theCase,
      civilClaimant,
      updateCivilClaimantDto,
      user,
      transaction,
    )
  }

  @UseGuards(CivilClaimantExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete(':civilClaimantId')
  @ApiOkResponse({
    type: DeleteCivilClaimantResponse,
    description: 'Civil claimant deleted',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
  ): Promise<DeleteCivilClaimantResponse> {
    this.logger.debug(
      `Deleting civil claimant ${civilClaimantId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.civilClaimantService.delete(
      caseId,
      civilClaimantId,
      transaction,
    )

    return { deleted }
  }
}
