import { JwtAuthGuard, RolesGuard, RolesRules, CurrentHttpUser } from "@island.is/judicial-system/auth"
import { ServiceRequirement, User } from "@island.is/judicial-system/types"
import { LOGGER_PROVIDER } from "@island.is/logging"
import { Controller, UseGuards, Inject, Patch, Param, Body } from "@nestjs/common"
import { ApiTags, ApiOkResponse } from "@nestjs/swagger"
import { prisonSystemStaffRule } from "../../guards"
import { CaseExistsGuard, CurrentCase, Case } from "../case"
import { DefendantService } from "./defendant.service"
import { UpdateDefendantDto } from "./dto/updateDefendant.dto"
import { CurrentDefendant } from "./guards/defendant.decorator"
import { DefendantExistsGuard } from "./guards/defendantExists.guard"
import { Defendant } from "./models/defendant.model"
import type { Logger } from '@island.is/logging'

// TODO: use or no use?
interface LimitedAccessUpdateDefendant
  extends Pick<
  UpdateDefendantDto,
    | 'punishmentType'
  > {}

@Controller('api/case/:caseId/limitedAccess/defendant')
@ApiTags('limited access defendant')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LimitedAccessDefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, DefendantExistsGuard)
  @RolesRules(
    prisonSystemStaffRule
  )
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
    @Body() updateDto: LimitedAccessUpdateDefendant,
  ): Promise<Defendant> {
    this.logger.debug(`Updating limitedAccess defendant ${defendantId} of case ${caseId}`)
    const { punishmentType } = updateDto;

    return this.defendantService.updateRequestCaseDefendant(
      theCase,
      defendant,
      { punishmentType },
      user,
    )
  }
}