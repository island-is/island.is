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
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'

import { CreateDraftAuthorDto } from './dto'
import { DraftAuthor } from './draft_author.model'
import { DraftAuthorService } from './draft_author.service'

import { environment } from '../../../environments'
const namespace = `${environment.audit.defaultNamespace}/draft_author`

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('api')
@ApiTags('draft_author')
@Audit({ namespace })
export class DraftAuthorController {
  constructor(private readonly draftAuthorService: DraftAuthorService) {}

  @Scopes('@island.is/regulations:create')
  @Post('draft_author')
  @ApiCreatedResponse({
    type: DraftAuthor,
    description: 'Creates a new DraftAuthor',
  })
  create(
    @Body()
    draftAuthorToCreate: CreateDraftAuthorDto,
    @CurrentUser() user: User,
  ): Promise<DraftAuthor> {
    return this.draftAuthorService.create(draftAuthorToCreate)
  }
}
