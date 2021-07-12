import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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

import {
  CreateDraftRegulationCancelDto,
  UpdateDraftRegulationCancelDto,
} from './dto'
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
    private readonly auditService: AuditService,
  ) {}

  @Scopes('@island.is/regulations:create')
  @Post('draft_regulation_cancel')
  @ApiCreatedResponse({
    type: DraftRegulationCancel,
    description: 'Creates a new DraftRegulationCancel',
  })
  @Audit<DraftRegulationCancel>({
    resources: (DraftRegulationCancel) => DraftRegulationCancel.id,
  })
  async create(
    @Body()
    draftRegulationCancelToCreate: CreateDraftRegulationCancelDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationCancel> {
    return await this.draftRegulationCancelService.create(
      draftRegulationCancelToCreate,
    )
  }

  @Scopes('@island.is/regulations:create')
  @Put('draft_regulation_cancel/:id')
  @ApiOkResponse({
    type: DraftRegulationCancel,
    description: 'Updates an existing user',
  })
  @Audit<DraftRegulationCancel>({
    resources: (DraftRegulationCancel) => DraftRegulationCancel.id,
  })
  async update(
    @Param('id') id: string,
    @Body() draftRegulationCancelToUpdate: UpdateDraftRegulationCancelDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationCancel> {
    const {
      numberOfAffectedRows,
      updatedDraftRegulationCancel,
    } = await this.draftRegulationCancelService.update(
      id,
      draftRegulationCancelToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulationCancel ${id} does not exist`)
    }

    return updatedDraftRegulationCancel
  }

  @Scopes('@island.is/regulations:create')
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
        user,
        action: 'delete',
        namespace,
        resources: id,
      },
      this.draftRegulationCancelService.delete(id),
    )
  }
}
