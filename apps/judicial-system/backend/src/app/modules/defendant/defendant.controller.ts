import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
  assistantRule,
} from '../../guards'
import { Case, CaseExistsGuard, CaseWriteGuard, CurrentCase } from '../case'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { CurrentDefendant } from './guards/defendant.decorator'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { DeleteDefendantResponse } from './models/delete.response'
import { Defendant } from './models/defendant.model'
import { DefendantService } from './defendant.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId/defendant')
@ApiTags('defendants')
export class DefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(prosecutorRule, representativeRule)
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

  @UseGuards(CaseExistsGuard, CaseWriteGuard, DefendantExistsGuard)
  @RolesRules(
    prosecutorRule,
    representativeRule,
    judgeRule,
    registrarRule,
    assistantRule,
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

  @UseGuards(CaseExistsGuard, CaseWriteGuard, DefendantExistsGuard)
  @RolesRules(prosecutorRule, representativeRule)
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
