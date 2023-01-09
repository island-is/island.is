import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Controller, Get, Inject, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  assistantRule,
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
  staffRule,
} from '../../guards'
import { Case } from '../case'
import { CaseListEntry } from './caseList.model'
import { CaseListService } from './caseList.service'

@Controller('api')
@ApiTags('cases')
export class CaseListController {
  constructor(
    private readonly caseListService: CaseListService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(
    prosecutorRule,
    representativeRule,
    judgeRule,
    registrarRule,
    assistantRule,
    staffRule,
  )
  @Get('cases')
  @ApiOkResponse({
    type: Case,
    isArray: true,
    description: 'Gets all existing cases',
  })
  getAll(@CurrentHttpUser() user: User): Promise<CaseListEntry[]> {
    this.logger.debug('Getting all cases')

    return this.caseListService.getAll(user)
  }
}
