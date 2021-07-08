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

import { CreateDraftLawChapterDto } from './dto'
import { DraftLawChapter } from './draft_law_chapter.model'
import { DraftLawChapterService } from './draft_law_chapter.service'

@Controller('api')
@ApiTags('draft_law_chapter')
export class DraftLawChapterController {
  constructor(
    private readonly draftRegulationService: DraftLawChapterService,
  ) {}

  // @UseGuards()
  @Post('draft_law_chapter')
  @ApiCreatedResponse({
    type: DraftLawChapter,
    description: 'Creates a new DraftLawChapter',
  })
  create(
    @Body()
    draftLawChapterToCreate: CreateDraftLawChapterDto,
  ): Promise<DraftLawChapter> {
    return this.draftRegulationService.create(draftLawChapterToCreate)
  }
}
