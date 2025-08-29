import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
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
import { type User } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CurrentCase } from '../case'
import { Case, Defendant } from '../repository'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { prisonSystemStaffUpdateRule } from './guards/rolesRules'
import { DefendantService } from './defendant.service'

@Controller('api/case/:caseId/limitedAccess/defendant')
@ApiTags('limited access defendant')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class LimitedAccessDefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, DefendantExistsGuard)
  @RolesRules(prisonSystemStaffUpdateRule)
  @Patch(':defendantId')
  @ApiOkResponse({
    type: Defendant,
    description: 'Updates a defendant',
  })
  updateDefendant(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() updateDto: Pick<UpdateDefendantDto, 'punishmentType'>,
  ): Promise<Defendant> {
    this.logger.debug(
      `Updating limitedAccess defendant ${defendantId} of case ${caseId}`,
    )
    return this.defendantService.update(theCase, defendant, updateDto, user)
  }
}
