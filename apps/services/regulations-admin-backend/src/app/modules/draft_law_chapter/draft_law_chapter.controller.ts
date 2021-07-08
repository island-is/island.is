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
import { CurrentUser, IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'

import { CreateDraftLawChapterDto } from './dto'
import { DraftLawChapter } from './draft_law_chapter.model'
import { DraftLawChapterService } from './draft_law_chapter.service'

import { environment } from '../../../environments'
const namespace = `${environment.audit.defaultNamespace}/draft_law_chapter`

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('api')
@ApiTags('draft_law_chapter')
@Audit({ namespace })
export class DraftLawChapterController {
  constructor(
    private readonly draftRegulationService: DraftLawChapterService,
  ) {}

  @Scopes('@island.is/regulations:create')
  @Post('draft_law_chapter')
  @ApiCreatedResponse({
    type: DraftLawChapter,
    description: 'Creates a new DraftLawChapter',
  })
  create(
    @Body()
    draftLawChapterToCreate: CreateDraftLawChapterDto,
    @CurrentUser() user: User,
  ): Promise<DraftLawChapter> {
    return this.draftRegulationService.create(draftLawChapterToCreate)
  }
}
