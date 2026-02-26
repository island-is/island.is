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

import {
  CaseExistsGuard,
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

@Controller('api/case/:caseId/limitedAccess/defendant')
@ApiTags('limited access defendant')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
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
  update(
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

    return this.sequelize.transaction((transaction) =>
      this.defendantService.update(
        theCase,
        defendant,
        updateDto,
        user,
        transaction,
      ),
    )
  }
}
