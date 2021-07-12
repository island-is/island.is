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
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiHeader,
} from '@nestjs/swagger'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { CreateDraftRegulationDto, UpdateDraftRegulationDto } from './dto'
import { DraftRegulation } from './draft_regulation.model'
import { DraftRegulationService } from './draft_regulation.service'
import { Audit, AuditService } from '@island.is/nest/audit'

import { environment } from '../../../environments'
const namespace = `${environment.audit.defaultNamespace}/draft_regulations`

// @UseGuards(IdsUserGuard, ScopesGuard)
// @ApiTags('draft_regulations')
// @ApiHeader({
//   name: 'authorization',
//   description: 'Bearer token authorization',
// })
@Controller('api')
@Audit({ namespace })
export class DraftRegulationController {
  constructor(
    private readonly draftRegulationService: DraftRegulationService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes('@island.is/regulations:create')
  @Post('draft_regulation')
  @ApiCreatedResponse({
    type: DraftRegulation,
    description: 'Creates a new DraftRegulation',
  })
  create(
    @Body()
    draftRegulationToCreate: CreateDraftRegulationDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulation> {
    return this.draftRegulationService.create(draftRegulationToCreate)
  }

  @Scopes('@island.is/regulations:create')
  @Put('draft_regulation/:id')
  @ApiOkResponse({
    type: DraftRegulation,
    description: 'Updates an existing user',
  })
  async update(
    @Param('id') id: string,
    @Body() draftRegulationToUpdate: UpdateDraftRegulationDto,
    @CurrentUser() user: User,
  ): Promise<DraftRegulation> {
    const {
      numberOfAffectedRows,
      updatedDraftRegulation,
    } = await this.draftRegulationService.update(id, draftRegulationToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulation ${id} does not exist`)
    }

    return updatedDraftRegulation
  }

  // @Scopes('@island.is/regulations:create')
  @Get('draft_regulations')
  @ApiOkResponse({
    type: DraftRegulation,
    isArray: true,
    description: 'Gets all existing DraftRegulations',
  })
  getAll(): Promise<DraftRegulation[]> {
    return this.draftRegulationService.getAll()
  }

  // @Scopes('@island.is/regulations:create')
  @Get('draft_regulation/:id')
  @ApiOkResponse({
    type: DraftRegulation,
    description: 'Gets a DraftRegulation',
  })
  async getById(@Param('id') id: string) {
    const draftRegulation = await this.draftRegulationService.findById(id)

    if (!draftRegulation) {
      throw new NotFoundException(`DraftRegulation ${id} not found`)
    }

    return draftRegulation
  }
}
