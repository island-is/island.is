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
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  publicProsecutorStaffRule,
} from '../../guards'
import {
  Case,
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { DefendantExistsGuard } from '../defendant'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { CurrentVerdict } from './guards/verdict.decorator'
import { VerdictExistsGuard } from './guards/verdictExists.guard'
import { Verdict } from './models/verdict.model'
import { VerdictService } from './verdict.service'

@Controller('api/case/:caseId')
@ApiTags('verdicts')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  CaseWriteGuard,
  CaseCompletedGuard,
  DefendantExistsGuard,
  VerdictExistsGuard,
)
export class VerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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
}
