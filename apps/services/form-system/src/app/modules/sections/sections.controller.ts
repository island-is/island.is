import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  Put,
  VERSION_NEUTRAL,
  UseGuards,
} from '@nestjs/common'
import { SectionsService } from './sections.service'
import { CreateSectionDto } from './models/dto/createSection.dto'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { UpdateSectionDto } from './models/dto/updateSection.dto'
import { SectionDto } from './models/dto/section.dto'
import { UpdateSectionsDisplayOrderDto } from './models/dto/updateSectionsDisplayOrder.dto'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
@ApiTags('sections')
@Controller({ path: 'sections', version: ['1', VERSION_NEUTRAL] })
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @ApiOperation({ summary: 'Creates a new section' })
  @ApiCreatedResponse({
    description: 'Creates a new section',
    type: SectionDto,
  })
  @ApiBody({ type: CreateSectionDto })
  @Post()
  create(@Body() createSectionDto: CreateSectionDto): Promise<SectionDto> {
    return this.sectionsService.create(createSectionDto)
  }

  @ApiOperation({ summary: 'Updates a section' })
  @ApiNoContentResponse({
    description: 'Updates a section',
  })
  @ApiBody({ type: UpdateSectionDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<void> {
    return await this.sectionsService.update(id, updateSectionDto)
  }

  @ApiOperation({ summary: 'Update display order of sections' })
  @ApiNoContentResponse({
    description: 'Update display order of sections',
  })
  @ApiBody({ type: UpdateSectionsDisplayOrderDto })
  @Put()
  async updateDisplayOrder(
    @Body() updateSectionsDisplayOrderDto: UpdateSectionsDisplayOrderDto,
  ): Promise<void> {
    return this.sectionsService.updateDisplayOrder(
      updateSectionsDisplayOrderDto,
    )
  }

  @ApiOperation({ summary: 'Delete section by id' })
  @ApiNoContentResponse({
    description: 'Delete section by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.sectionsService.delete(id)
  }
}
