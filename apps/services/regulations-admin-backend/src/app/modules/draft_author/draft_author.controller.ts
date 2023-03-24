import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'

import { CreateDraftAuthorDto } from './dto'
import { DraftAuthorModel } from './draft_author.model'
import { DraftAuthorService } from './draft_author.service'

import { environment } from '../../../environments'
import { AdminPortalScope } from '@island.is/auth/scopes'
const namespace = `${environment.audit.defaultNamespace}/draft_author`

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('api')
@ApiTags('draft_author')
@Audit({ namespace })
export class DraftAuthorController {
  constructor(
    private readonly draftAuthorService: DraftAuthorService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(AdminPortalScope.regulationAdmin)
  @Post('draft_author')
  @ApiCreatedResponse({
    type: DraftAuthorModel,
    description: 'Creates a new DraftAuthor',
  })
  @Audit<DraftAuthorModel>({
    resources: (DraftAuthor) => DraftAuthor.id,
  })
  async create(
    @Body()
    authorToCreate: CreateDraftAuthorDto,
  ): Promise<DraftAuthorModel> {
    return await this.draftAuthorService.create(authorToCreate)
  }
}
