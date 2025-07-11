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
import { ServiceRequirement } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../guards'
import {
  Case,
  CurrentCase,
  MinimalCaseAccessGuard,
  MinimalCaseExistsGuard,
} from '../case'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { ValidateVerdictGuard } from './guards/validateVerdict.guard'
import { CurrentVerdict } from './guards/verdict.decorator'
import { VerdictWriteGuard } from './guards/verdictWrite.guard'
import { Verdict } from './models/verdict.model'
import { VerdictService } from './verdict.service'

@Controller('api/case/:caseId/defendant/:defendantId/verdict')
@ApiTags('verdicts')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  MinimalCaseExistsGuard,
  MinimalCaseAccessGuard,
  ValidateVerdictGuard,
)
export class VerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(VerdictWriteGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':verdictId')
  @ApiOkResponse({
    type: Verdict,
    description: 'Updates a verdict',
  })
  update(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('verdictId') verdictId: string,
    @CurrentCase() theCase: Case,
    @CurrentVerdict() verdict: Verdict,
    @Body() verdictToUpdate: UpdateVerdictDto,
  ): Promise<Verdict> {
    this.logger.debug(`Updating verdict for ${verdictId} of ${caseId}`)

    // when defendant is present in court hearing, we set the service date as the ruling date
    if (
      verdictToUpdate.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
    ) {
      verdictToUpdate = { ...verdictToUpdate, serviceDate: theCase.rulingDate }
    }

    return this.verdictService.updateVerdict(verdict, verdictToUpdate)
  }
}
