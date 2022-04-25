import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { defenderRule } from '../../guards/rolesRules'
import { RestrictedCaseExistsGuard } from './guards/restrictedCaseExists.guard'
import { CaseDefenderGuard } from './guards/caseDefender.guard'
import { CurrentCase } from './guards/case.decorator'
import { Case } from './models/case.model'

@Controller('api/case/:caseId/restricted')
@UseGuards(
  new JwtAuthGuard(true),
  RolesGuard,
  RestrictedCaseExistsGuard,
  CaseDefenderGuard,
)
@RolesRules(defenderRule)
@ApiTags('restricted cases')
export class RestrictedCaseController {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  @Get()
  @ApiOkResponse({
    type: Case,
    description: 'Gets a limited set of properties of an existing case',
  })
  getById(@Param('caseId') caseId: string, @CurrentCase() theCase: Case): Case {
    this.logger.debug(`Getting restricted case ${caseId} by id`)

    return theCase
  }
}
