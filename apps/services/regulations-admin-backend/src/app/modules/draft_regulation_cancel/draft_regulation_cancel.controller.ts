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
  CreateDraftRegulationCancelDto,
  UpdateDraftRegulationCancelDto,
} from './dto'
import { DraftRegulationCancelModel } from './draft_regulation_cancel.model'
import { DraftRegulationCancelService } from './draft_regulation_cancel.service'

import { environment } from '../../../environments'
const namespace = `${environment.audit.defaultNamespace}/draft_regulation_cancel`

import { DraftRegulationCancel } from '@island.is/regulations/admin'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.regulationAdmin)
@Controller('api')
@ApiTags('draft_regulation_cancel')
@Audit({ namespace })
export class DraftRegulationCancelController {
  constructor(
    private readonly draftRegulationCancelService: DraftRegulationCancelService,
    private readonly auditService: AuditService,
  ) {}

  @Post('draft_regulation_cancel')
  @ApiCreatedResponse({
    type: DraftRegulationCancelModel,
    description: 'Creates a new DraftRegulationCancel',
  })
  @Audit<DraftRegulationCancelModel>({
    resources: (DraftRegulationCancel) => DraftRegulationCancel.id,
  })
  async create(
    @Body() draftRegulationCancelToCreate: CreateDraftRegulationCancelDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationCancel> {
    return await this.draftRegulationCancelService.create(
      draftRegulationCancelToCreate,
    )
  }

  @Put('draft_regulation_cancel/:id')
  @ApiOkResponse({
    type: DraftRegulationCancelModel,
    description: 'Updates an existing user',
  })
  @Audit<DraftRegulationCancelModel>({
    resources: (DraftRegulationCancel) => DraftRegulationCancel.id,
  })
  async update(
    @Param('id') id: string,
    @Body() draftRegulationCancelToUpdate: UpdateDraftRegulationCancelDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationCancel> {
    if (!draftRegulationCancelToUpdate.date) {
      await this.draftRegulationCancelService.delete(id)
      throw new NotFoundException(`DraftRegulationCancel ${id} was deleted`)
    }

    const { numberOfAffectedRows, draftRegulationCancel } =
      await this.draftRegulationCancelService.update(
        id,
        draftRegulationCancelToUpdate,
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulationCancel ${id} does not exist`)
    }

    return draftRegulationCancel
  }

  @Delete('draft_regulation_cancel/:id')
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
      this.draftRegulationCancelService.delete(id),
    )
  }

  @Delete('draft_regulation_cancel/:draftId')
  @ApiCreatedResponse()
  async deleteRegulationDraftCancels(
    @Param('draftId') draftId: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!draftId) {
      throw new BadRequestException('draftId must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'deleteRegulationDraftCancels',
        namespace,
        resources: draftId,
      },
      this.draftRegulationCancelService.deleteRegulationDraftCancels(draftId),
    )
  }
}
