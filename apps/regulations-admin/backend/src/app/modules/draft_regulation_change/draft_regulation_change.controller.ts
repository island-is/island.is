import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
  TokenGuaard,
} from '@island.is/judicial-system/auth'

import { CreateDraftRegulationChangeDto } from './dto'
import { DraftRegulationChange } from './draft_regulation_change.model'
import { DraftRegulationChangeService } from './draft_regulation_change.service'

@Controller('api')
@ApiTags('draft_regulations')
export class DraftRegulationChangeController {
  constructor(private readonly draftRegulationService: DraftRegulationChangeService) {}

  // @UseGuards()
  @Post('draft_regulation')
  @ApiCreatedResponse({ type: DraftRegulationChange, description: 'Creates a new DraftRegulationChange' })
  create(
    @Body()
    draftRegulationToCreate: CreateDraftRegulationChangeDto,
  ): Promise<DraftRegulationChange> {
    return this.draftRegulationService.create(draftRegulationToCreate)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('draft_regulations')
  @ApiOkResponse({
    type: DraftRegulationChange,
    isArray: true,
    description: 'Gets all DraftRegulationChange for regulation',
  })
  getAll(): Promise<DraftRegulationChange[]> {
    return this.draftRegulationService.getAll()
  }
}
