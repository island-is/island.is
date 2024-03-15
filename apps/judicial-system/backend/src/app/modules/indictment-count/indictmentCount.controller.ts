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
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { prosecutorRepresentativeRule, prosecutorRule } from '../../guards'
import { CaseExistsGuard, CaseWriteGuard } from '../case'
import { UpdateIndictmentCountDto } from './dto/updateIndictmentCount.dto'
import { IndictmentCountExistsGuard } from './guards/indictmentCountExists.guard'
import { DeleteIndictmentCountResponse } from './models/delete.response'
import { IndictmentCount } from './models/indictmentCount.model'
import { IndictmentCountService } from './indictmentCount.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId/indictmentCount')
@ApiTags('indictment-counts')
export class IndictmentCountController {
  constructor(
    private readonly indictmentCountService: IndictmentCountService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post()
  @ApiCreatedResponse({
    type: IndictmentCount,
    description: 'Creates a new indictment count',
  })
  create(@Param('caseId') caseId: string): Promise<IndictmentCount> {
    this.logger.debug(`Creating a new indictment count for case ${caseId}`)

    return this.indictmentCountService.create(caseId)
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard, IndictmentCountExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Patch(':indictmentCountId')
  @ApiOkResponse({
    type: IndictmentCount,
    description: 'Updates an indictment count',
  })
  update(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Body() indictmentCountToUpdate: UpdateIndictmentCountDto,
  ): Promise<IndictmentCount> {
    this.logger.debug(
      `Updating indictment count ${indictmentCountId} of case ${caseId}`,
    )

    return this.indictmentCountService.update(
      caseId,
      indictmentCountId,
      indictmentCountToUpdate,
    )
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard, IndictmentCountExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete(':indictmentCountId')
  @ApiOkResponse({ description: 'Deletes an indictment count' })
  async delete(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
  ): Promise<DeleteIndictmentCountResponse> {
    this.logger.debug(
      `Deleting indictment count ${indictmentCountId} of case ${caseId}`,
    )

    const deleted = await this.indictmentCountService.delete(
      caseId,
      indictmentCountId,
    )

    return { deleted }
  }
}
