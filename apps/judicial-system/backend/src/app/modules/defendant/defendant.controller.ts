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
import { CaseExistsGuard, CaseWriteGuard, CurrentCase } from '../case'
import { Case, Defendant } from '../repository'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { DeleteDefendantResponse } from './models/delete.response'
import { DefendantService } from './defendant.service'

@Controller('api/case/:caseId/defendant')
@ApiTags('defendants')
@UseGuards(JwtAuthUserGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
export class DefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post()
  @ApiCreatedResponse({
    type: Defendant,
    description: 'Creates a new defendant',
  })
  create(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() defendantToCreate: CreateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Creating a new defendant for case ${caseId}`)

    return this.defendantService.create(theCase, defendantToCreate, user)
  }

  @UseGuards(DefendantExistsGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
  )
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
    @Body() defendantToUpdate: UpdateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Updating defendant ${defendantId} of case ${caseId}`)

    return this.defendantService.update(
      theCase,
      defendant,
      defendantToUpdate,
      user,
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

    const deleted = await this.defendantService.delete(
      theCase,
      defendantId,
      user,
    )

    return { deleted }
  }
}
