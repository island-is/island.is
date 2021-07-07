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

import { CreateDraftRegulationCancelDto } from './dto'
import { DraftRegulationCancel } from './draft_regulation_cancel.model'
import { DraftRegulationCancelService } from './draft_regulation_cancel.service'

@Controller('api')
@ApiTags('draft_regulations')
export class DraftRegulationCancelController {
  constructor(private readonly draftRegulationService: DraftRegulationCancelService) {}

  // @UseGuards()
  @Post('draft_regulation')
  @ApiCreatedResponse({ type: DraftRegulationCancel, description: 'Creates a new DraftRegulationCancel' })
  create(
    @Body()
    draftRegulationToCreate: CreateDraftRegulationCancelDto,
  ): Promise<DraftRegulationCancel> {
    return this.draftRegulationService.create(draftRegulationToCreate)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('draft_regulations')
  @ApiOkResponse({
    type: DraftRegulationCancel,
    isArray: true,
    description: 'Gets all DraftRegulationCancel for regulation',
  })
  getAll(): Promise<DraftRegulationCancel[]> {
    return this.draftRegulationService.getAll()
  }
}
