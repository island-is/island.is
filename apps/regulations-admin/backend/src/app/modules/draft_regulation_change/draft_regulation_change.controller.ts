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

import { CreateDraftRegulationChangeDto } from './dto'
import { DraftRegulationChange } from './draft_regulation_change.model'
import { DraftRegulationChangeService } from './draft_regulation_change.service'

@Controller('api')
@ApiTags('draft_regulation_change')
export class DraftRegulationChangeController {
  constructor(
    private readonly draftRegulationService: DraftRegulationChangeService,
  ) {}

  // @UseGuards()
  @Post('draft_regulation_change')
  @ApiCreatedResponse({
    type: DraftRegulationChange,
    description: 'Creates a new DraftRegulationChange',
  })
  create(
    @Body()
    draftRegulationChangeToCreate: CreateDraftRegulationChangeDto,
  ): Promise<DraftRegulationChange> {
    return this.draftRegulationService.create(draftRegulationChangeToCreate)
  }
}
