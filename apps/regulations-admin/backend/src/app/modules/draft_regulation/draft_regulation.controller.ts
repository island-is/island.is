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

import { CreateDraftRegulationDto, UpdateDraftRegulationDto } from './dto'
import { DraftRegulation } from './draft_regulation.model'
import { DraftRegulationService } from './draft_regulation.service'

@Controller('api')
@ApiTags('draft_regulations')
export class DraftRegulationController {
  constructor(private readonly draftRegulationService: DraftRegulationService) {}

  // @UseGuards()
  @Post('draft_regulation')
  @ApiCreatedResponse({ type: DraftRegulation, description: 'Creates a new DraftRegulation' })
  create(
    @Body()
    draftRegulationToCreate: CreateDraftRegulationDto,
  ): Promise<DraftRegulation> {
    return this.draftRegulationService.create(draftRegulationToCreate)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('draft_regulation/:id')
  @ApiOkResponse({ type: DraftRegulation, description: 'Updates an existing user' })
  async update(
    @Param('id') id: string,
    @Body() draftRegulationToUpdate: UpdateDraftRegulationDto,
  ): Promise<DraftRegulation> {
    const { numberOfAffectedRows, updatedDraftRegulation } = await this.draftRegulationService.update(
      id,
      draftRegulationToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`DraftRegulation ${id} does not exist`)
    }

    return updatedDraftRegulation
  }

  // @UseGuards(JwtAuthGuard)
  @Get('draft_regulations')
  @ApiOkResponse({
    type: DraftRegulation,
    isArray: true,
    description: 'Gets all existing DraftRegulations',
  })
  getAll(): Promise<DraftRegulation[]> {
    return this.draftRegulationService.getAll()
  }

  // @UseGuards(JwtAuthGuard)
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
