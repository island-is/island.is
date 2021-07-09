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

import { CreateDraftRegulationChangeDto, UpdateDraftRegulationChangeDto } from './dto'
import { DraftRegulationChange } from './draft_regulation_change.model'
import { DraftRegulationChangeService } from './draft_regulation_change.service'

import { environment } from '../../../environments'
const namespace = `${environment.audit.defaultNamespace}/draft_regulation_change`

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('api')
@ApiTags('draft_regulation_change')
@Audit({ namespace })
export class DraftRegulationChangeController {
  constructor(
    private readonly draftRegulationChangeService: DraftRegulationChangeService,
  ) {}

  @Scopes('@island.is/regulations:create')
  @Post('draft_regulation_change')
  @ApiCreatedResponse({
    type: DraftRegulationChange,
    description: 'Creates a new DraftRegulationChange',
  })
  create(
    @Body()
    draftRegulationChangeToCreate: CreateDraftRegulationChangeDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationChange> {
    return this.draftRegulationChangeService.create(draftRegulationChangeToCreate)
  }

  @Scopes('@island.is/regulations:create')
  @Put('draft_regulation_cancel/:id')
  @ApiOkResponse({
    type: DraftRegulationChange,
    description: 'Updates an existing user',
  })
  async update(
    @Param('id') id: string,
    @Body() draftRegulationChangeToUpdate: UpdateDraftRegulationChangeDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationChange> {
    const {
      numberOfAffectedRows,
      updatedDraftRegulationChange,
    } = await this.draftRegulationChangeService.update(id, draftRegulationChangeToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulationChange ${id} does not exist`)
    }

    return updatedDraftRegulationChange
  }
}
