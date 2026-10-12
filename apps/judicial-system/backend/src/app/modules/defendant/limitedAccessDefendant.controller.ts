import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
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
import { indictmentCases, type User } from '@island.is/judicial-system/types'

import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { Case, Defendant } from '../repository'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { prisonSystemStaffUpdateRule } from './guards/rolesRules'
import { DefendantService } from './defendant.service'

// The one route here changes a defendant of the case, and decides what to
// change from the case the guard loaded: the update branches on the case type
// and on the defendant row the guard found on the case. CaseExistsForUpdateGuard
// reads the case under FOR UPDATE in the request's transaction, so this
// request serializes on the case row with every other converted route on the
// case, which locks the same row.
//
// RolesGuard runs first, ahead of the guard that takes the write lock. It can,
// because the route's only rule is a field rule - it reads the body, not the
// case - and has no canActivate: a caller this controller has no rule for is
// turned away before any case row is locked.
// limitedAccessDefendantRolesRules.spec.ts pins that assumption.
//
// The guards after the locking read all decide from request.case and so see
// the locked row - including DefendantExistsGuard.
@Controller('api/case/:caseId/limitedAccess/defendant')
@ApiTags('limited access defendant')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsForUpdateGuard,
  new CaseTypeGuard(indictmentCases),
  CaseWriteGuard,
  DefendantExistsGuard,
)
export class LimitedAccessDefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(prisonSystemStaffUpdateRule)
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
    @Body()
    updateDto: Pick<
      UpdateDefendantDto,
      'punishmentType' | 'isRegisteredInPrisonSystem'
    >,
  ): Promise<Defendant> {
    this.logger.debug(
      `Updating limitedAccess defendant ${defendantId} of case ${caseId}`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.defendantService.update(
      theCase,
      defendant,
      updateDto,
      user,
      transaction,
    )
  }
}
