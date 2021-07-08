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

import { CreateDraftAuthorDto } from './dto'
import { DraftAuthor } from './draft_author.model'
import { DraftAuthorService } from './draft_author.service'

@Controller('api')
@ApiTags('draft_regulations')
export class DraftAuthorController {
  constructor(private readonly draftRegulationService: DraftAuthorService) {}

  // @UseGuards()
  @Post('draft_regulation')
  @ApiCreatedResponse({
    type: DraftAuthor,
    description: 'Creates a new DraftAuthor',
  })
  create(
    @Body()
    draftRegulationToCreate: CreateDraftAuthorDto,
  ): Promise<DraftAuthor> {
    return this.draftRegulationService.create(draftRegulationToCreate)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('draft_regulations')
  @ApiOkResponse({
    type: DraftAuthor,
    isArray: true,
    description: 'Gets all DraftAuthor for regulation',
  })
  getAll(): Promise<DraftAuthor[]> {
    return this.draftRegulationService.getAll()
  }
}
