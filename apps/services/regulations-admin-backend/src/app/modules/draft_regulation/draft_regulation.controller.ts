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
  Query,
} from '@nestjs/common'
import { DraftImpact } from '@island.is/regulations/admin'
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'
import { AdminPortalScope } from '@island.is/auth/scopes'
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
import { ShippedSummary, TaskListType } from '@island.is/regulations/admin'
import { RegQueryName } from '@island.is/regulations'
import { DraftRegulationShippedModel } from './models/draftRegulationShipped.model'
import { DraftRegulationTemplate } from './models/draftRegulation.model'
import { TaskListModel } from './models/taskList.model'
import { DraftImpactModel } from './models/draftImpacts.model'
const namespace = `${environment.audit.defaultNamespace}/draft_regulations`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.regulationAdmin)
@Controller('api')
@ApiTags('draft_regulations')
@Audit({ namespace })
export class DraftRegulationController {
  constructor(
    private readonly draftRegulationService: DraftRegulationService,
    private readonly auditService: AuditService,
  ) {}

  @Post('draft_regulation')
  @ApiCreatedResponse({
    type: DraftRegulationModel,
    description: 'Creates a new DraftRegulation',
  })
  @Audit<DraftRegulationModel>({
    resources: (DraftRegulation) => DraftRegulation.id,
  })
  async create(
    @Body() draftRegulationToCreate: CreateDraftRegulationDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulationModel> {
    return await this.draftRegulationService.create(
      draftRegulationToCreate,
      user,
    )
  }

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
    const { numberOfAffectedRows, updatedDraftRegulation } =
      await this.draftRegulationService.update(
        id,
        draftRegulationToUpdate,
        user,
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulation ${id} does not exist`)
    }

    return updatedDraftRegulation
  }

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

  @Get('draft_regulations')
  @ApiOkResponse({
    type: TaskListModel,
    description: 'Gets all DraftRegulations with status draft and proposal',
  })
  async getAll(
    @CurrentUser() user: User,
    @Param('page') page: number,
  ): Promise<TaskListType> {
    // managers can see all, creators can only see their own
    const canManage = user.scope.includes(
      AdminPortalScope.regulationAdminManage,
    )

    return await this.draftRegulationService.getAll(
      !canManage ? user : undefined,
      page,
    )
  }

  @Get('draft_regulations_shipped')
  @ApiOkResponse({
    type: DraftRegulationShippedModel,
    isArray: true,
    description: 'Gets all DraftRegulations with status shipped',
  })
  async getAllShipped(@CurrentUser() user: User): Promise<ShippedSummary[]> {
    const canManage = user.scope.includes(
      AdminPortalScope.regulationAdminManage,
    )
    if (!canManage) {
      return []
    }
    return await this.draftRegulationService.getAllShipped()
  }

  @Get('draft_regulation/:id')
  @ApiOkResponse({
    type: DraftRegulationTemplate,
    description: 'Gets a DraftRegulation',
  })
  async getById(@Param('id') id: string, @CurrentUser() user: User) {
    const draftRegulation = await this.draftRegulationService.findById(id)

    if (!draftRegulation) {
      throw new NotFoundException(`DraftRegulation ${id} not found`)
    }

    return draftRegulation
  }

  @Get('draft_regulation_impacts/:name')
  @ApiOkResponse({
    description: 'Gets all DraftRegulationImpacts by RegName',
    isArray: true,
    type: DraftImpactModel,
  })
  async getImpactsByName(
    @Param('name') name: RegQueryName,
    @CurrentUser() user: User,
  ): Promise<DraftImpact[]> {
    const draftRegulationImpacts =
      await this.draftRegulationService.getRegulationImpactsByName(name)

    return draftRegulationImpacts
  }
}
