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

import { CreateDraftRegulationCancelDto, UpdateDraftRegulationCancelDto } from './dto'
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
    private readonly draftRegulationCancelService: DraftRegulationCancelService,
  ) {}

  @Scopes('@island.is/regulations:create')
  @Post('draft_regulation_cancel')
  @ApiCreatedResponse({
    type: DraftRegulationCancel,
    description: 'Creates a new DraftRegulationCancel',
  })
  async create(
    @Body()
    draftRegulationCancelToCreate: CreateDraftRegulationCancelDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationCancel> {
    return await this.draftRegulationCancelService.create(draftRegulationCancelToCreate)
  }

  @Scopes('@island.is/regulations:create')
  @Put('draft_regulation_cancel/:id')
  @ApiOkResponse({
    type: DraftRegulationCancel,
    description: 'Updates an existing user',
  })
  async update(
    @Param('id') id: string,
    @Body() draftRegulationCancelToUpdate: UpdateDraftRegulationCancelDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationCancel> {
    const {
      numberOfAffectedRows,
      updatedDraftRegulationCancel,
    } = await this.draftRegulationCancelService.update(id, draftRegulationCancelToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulationCancel ${id} does not exist`)
    }

    return updatedDraftRegulationCancel
  }
}
