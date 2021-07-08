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
@ApiTags('draft_author')
export class DraftAuthorController {
  constructor(private readonly draftAuthorService: DraftAuthorService) {}

  // @UseGuards()
  @Post('draft_author')
  @ApiCreatedResponse({
    type: DraftAuthor,
    description: 'Creates a new DraftAuthor',
  })
  create(
    @Body()
    draftAuthorToCreate: CreateDraftAuthorDto,
  ): Promise<DraftAuthor> {
    return this.draftAuthorService.create(draftAuthorToCreate)
  }
}
