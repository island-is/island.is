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

import { CreateDraftRegulationCancelDto } from './dto'
import { DraftRegulationCancel } from './draft_regulation_cancel.model'
import { DraftRegulationCancelService } from './draft_regulation_cancel.service'

@Controller('api')
@ApiTags('draft_regulation_cancel')
export class DraftRegulationCancelController {
  constructor(
    private readonly draftRegulationService: DraftRegulationCancelService,
  ) {}

  // @UseGuards()
  @Post('draft_regulation_cancel')
  @ApiCreatedResponse({
    type: DraftRegulationCancel,
    description: 'Creates a new DraftRegulationCancel',
  })
  create(
    @Body()
    draftRegulationCancelToCreate: CreateDraftRegulationCancelDto,
  ): Promise<DraftRegulationCancel> {
    return this.draftRegulationService.create(draftRegulationCancelToCreate)
  }
}
