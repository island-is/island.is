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
import { type User } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import { CaseExistsForUpdateGuard, CaseWriteGuard, CurrentCase } from '../case'
import { Case, Defendant } from '../repository'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import {
  courtOfAppealsAssistantUpdateDefendantRule,
  courtOfAppealsJudgeUpdateDefendantRule,
  courtOfAppealsRegistrarUpdateDefendantRule,
} from './guards/rolesRules'
import { DeleteDefendantResponse } from './models/delete.response'
import { DefendantService } from './defendant.service'

// Every route here changes the case's defendants, and each decides what to
// change from the case the guard loaded: create and delete branch on whether
// the case is at court, update on the verdict appeal's state, the case type
// and the defendant row the guard found on the case. CaseExistsForUpdateGuard
// reads the case under FOR UPDATE in the request's transaction, so two of
// these requests on one case serialize on the case row and the second sees
// the first's commit - and so do the converted case routes, which lock the
// same row.
//
// RolesGuard runs first, ahead of the guard that takes the write lock. It
// can, because every rule on these routes decides on the user alone - the
// court of appeals rules are field rules, which read the body, not the case -
// and none has a canActivate: a caller this controller has no rule for is
// turned away before any case row is locked. defendantRolesRules.spec.ts pins
// that assumption, so a rule that starts reading the case cannot silently
// reopen the exposure.
//
// The guards after the locking read all decide from request.case and so see
// the locked row - including DefendantExistsGuard on the routes that name a
// defendant.
@Controller('api/case/:caseId/defendant')
@ApiTags('defendants')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsForUpdateGuard,
  CaseWriteGuard,
)
export class DefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post()
  @ApiCreatedResponse({
    type: Defendant,
    description: 'Creates a new defendant',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() defendantToCreate: CreateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Creating a new defendant for case ${caseId}`)

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.defendantService.create(
      theCase,
      defendantToCreate,
      user,
      transaction,
    )
  }

  @UseGuards(DefendantExistsGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
    // Field rules, unlike the role rules above: this court settles the appeal
    // proceeding's defender and nothing else on the defendant.
    courtOfAppealsJudgeUpdateDefendantRule,
    courtOfAppealsRegistrarUpdateDefendantRule,
    courtOfAppealsAssistantUpdateDefendantRule,
  )
  @Patch(':defendantId')
  @ApiOkResponse({
    type: Defendant,
    description: 'Updates a defendant',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() defendantToUpdate: UpdateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Updating defendant ${defendantId} of case ${caseId}`)

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.defendantService.update(
      theCase,
      defendant,
      defendantToUpdate,
      user,
      transaction,
    )
  }

  @UseGuards(DefendantExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete(':defendantId')
  @ApiOkResponse({ description: 'Deletes a defendant' })
  async delete(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<DeleteDefendantResponse> {
    this.logger.debug(`Deleting defendant ${defendantId} of case ${caseId}`)

    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.defendantService.delete(
      theCase,
      defendantId,
      user,
      transaction,
    )

    return { deleted }
  }
}
