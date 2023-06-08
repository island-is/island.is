import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
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

import {
  CreateDraftRegulationChangeDto,
  UpdateDraftRegulationChangeDto,
} from './dto'
import { DraftRegulationChangeModel } from './draft_regulation_change.model'
import { DraftRegulationChangeService } from './draft_regulation_change.service'

import { environment } from '../../../environments'
import { DraftRegulationChange } from '@island.is/regulations/admin'
import { AdminPortalScope } from '@island.is/auth/scopes'
const namespace = `${environment.audit.defaultNamespace}/draft_regulation_change`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.regulationAdmin)
@Controller('api')
@ApiTags('draft_regulation_change')
@Audit({ namespace })
export class DraftRegulationChangeController {
  constructor(
    private readonly draftRegulationChangeService: DraftRegulationChangeService,
    private readonly auditService: AuditService,
  ) {}

  @Post('draft_regulation_change')
  @ApiCreatedResponse({
    type: DraftRegulationChangeModel,
    description: 'Creates a new DraftRegulationChange',
  })
  @Audit<DraftRegulationChangeModel>({
    resources: (DraftRegulationChange) => DraftRegulationChange.id,
  })
  create(
    @Body() draftRegulationChangeToCreate: CreateDraftRegulationChangeDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationChange> {
    return this.draftRegulationChangeService.create(
      draftRegulationChangeToCreate,
    )
  }

  @Put('draft_regulation_change/:id')
  @ApiOkResponse({
    type: DraftRegulationChangeModel,
    description: 'Updates an existing DraftRegulationChange',
  })
  @Audit<DraftRegulationChangeModel>({
    resources: (DraftRegulationChange) => DraftRegulationChange.id,
  })
  async update(
    @Param('id') id: string,
    @Body() draftRegulationChangeToUpdate: UpdateDraftRegulationChangeDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationChange> {
    const { numberOfAffectedRows, updatedDraftRegulationChange } =
      await this.draftRegulationChangeService.update(
        id,
        draftRegulationChangeToUpdate,
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulationChange ${id} does not exist`)
    }

    return updatedDraftRegulationChange
  }

  @Delete('draft_regulation_change/:id')
  @ApiCreatedResponse()
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: id,
      },
      this.draftRegulationChangeService.delete(id),
    )
  }
}
