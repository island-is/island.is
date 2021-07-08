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

import { CreateDraftLawChapterDto } from './dto'
import { DraftLawChapter } from './draft_law_chapter.model'
import { DraftLawChapterService } from './draft_law_chapter.service'

@Controller('api')
@ApiTags('draft_regulations')
export class DraftLawChapterController {
  constructor(
    private readonly draftRegulationService: DraftLawChapterService,
  ) {}

  // @UseGuards()
  @Post('draft_regulation')
  @ApiCreatedResponse({
    type: DraftLawChapter,
    description: 'Creates a new DraftLawChapter',
  })
  create(
    @Body()
    draftRegulationToCreate: CreateDraftLawChapterDto,
  ): Promise<DraftLawChapter> {
    return this.draftRegulationService.create(draftRegulationToCreate)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('draft_regulations')
  @ApiOkResponse({
    type: DraftLawChapter,
    isArray: true,
    description: 'Gets all DraftLawChapter for regulation',
  })
  getAll(): Promise<DraftLawChapter[]> {
    return this.draftRegulationService.getAll()
  }
}
