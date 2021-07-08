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

import { CreateDraftRegulationCancelDto } from './dto'
import { DraftRegulationCancel } from './draft_regulation_cancel.model'
import { DraftRegulationCancelService } from './draft_regulation_cancel.service'

import { environment } from '../../../environments'
const namespace = `${environment.audit.defaultNamespace}/draft_regulation_cancel`

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('api')
@ApiTags('draft_regulation_cancel')
@Audit({ namespace })
export class DraftRegulationCancelController {
  constructor(
    private readonly draftRegulationService: DraftRegulationCancelService,
  ) {}

  @Scopes('@island.is/regulations:create')
  @Post('draft_regulation_cancel')
  @ApiCreatedResponse({
    type: DraftRegulationCancel,
    description: 'Creates a new DraftRegulationCancel',
  })
  create(
    @Body()
    draftRegulationCancelToCreate: CreateDraftRegulationCancelDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationCancel> {
    return this.draftRegulationService.create(draftRegulationCancelToCreate)
  }
}
