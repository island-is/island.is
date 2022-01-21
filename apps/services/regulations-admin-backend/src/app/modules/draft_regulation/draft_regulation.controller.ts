import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { CreateDraftRegulationDto, UpdateDraftRegulationDto } from './dto'
import { DraftRegulationModel } from './draft_regulation.model'
import { DraftRegulationService } from './draft_regulation.service'
import { Audit, AuditService } from '@island.is/nest/audit'

import { environment } from '../../../environments'
import { DraftSummary } from '@island.is/regulations/admin'
import { Kennitala } from '@island.is/regulations'
const namespace = `${environment.audit.defaultNamespace}/draft_regulations`

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('api')
@ApiTags('draft_regulations')
@Audit({ namespace })
export class DraftRegulationController {
  constructor(
    private readonly draftRegulationService: DraftRegulationService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes('@island.is/regulations:create')
  @Post('draft_regulation')
  @ApiCreatedResponse({
    type: DraftRegulationModel,
    description: 'Creates a new DraftRegulation',
  })
  @Audit<DraftRegulationModel>({
    resources: (DraftRegulation) => DraftRegulation.id,
  })
  async create(
    @Body()
    draftRegulationToCreate: CreateDraftRegulationDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationModel> {
    return await this.draftRegulationService.create(
      draftRegulationToCreate,
      user,
    )
  }

  @Scopes('@island.is/regulations:create')
  @Put('draft_regulation/:id')
  @Audit<DraftRegulationModel>({
    resources: (DraftRegulation) => DraftRegulation.id,
  })
  @ApiOkResponse({
    type: DraftRegulationModel,
    description: 'Updates an existing DraftRegulation',
  })
  async update(
    @Param('id') id: string,
    @Body() draftRegulationToUpdate: UpdateDraftRegulationDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationModel> {
    const {
      numberOfAffectedRows,
      updatedDraftRegulation,
    } = await this.draftRegulationService.update(
      id,
      draftRegulationToUpdate,
      user,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulation ${id} does not exist`)
    }

    return updatedDraftRegulation
  }

  @Scopes('@island.is/regulations:create')
  @Delete('draft_regulation/:id')
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
      this.draftRegulationService.delete(id),
    )
  }

  @Scopes('@island.is/regulations:create')
  @Get('draft_regulations')
  @ApiOkResponse({
    type: DraftRegulationModel,
    isArray: true,
    description: 'Gets all DraftRegulations with status draft and proposal',
  })
  async getAll(@CurrentUser() user: User): Promise<DraftSummary[]> {
    const canManage = user.scope.includes('@island.is/regulations:manage')
    return await this.draftRegulationService.getAll(
      !canManage ? user : undefined,
    )
  }

  @Scopes('@island.is/regulations:create')
  @Get('draft_regulations_shipped')
  @ApiOkResponse({
    type: DraftRegulationModel,
    isArray: true,
    description: 'Gets all DraftRegulations with status shipped',
  })
  async getAllShipped(@CurrentUser() user: User): Promise<DraftSummary[]> {
    const canManage = user.scope.includes('@island.is/regulations:manage')
    if (!canManage) {
      return []
    }
    return await this.draftRegulationService.getAllShipped()
  }

  @Scopes('@island.is/regulations:create')
  @Get('draft_regulation/:id')
  @ApiOkResponse({
    type: DraftRegulationModel,
    description: 'Gets a DraftRegulation',
  })
  async getById(@Param('id') id: string, @CurrentUser() user: User) {
    const draftRegulation = await this.draftRegulationService.findById(id)

    if (!draftRegulation) {
      throw new NotFoundException(`DraftRegulation ${id} not found`)
    }

    return draftRegulation
  }
}
