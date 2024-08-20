import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  Put,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { SectionsService } from './sections.service'
import { CreateSectionDto } from './models/dto/createSection.dto'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'
import { UpdateSectionDto } from './models/dto/updateSection.dto'
import { SectionDto } from './models/dto/section.dto'
import { UpdateSectionsDisplayOrderDto } from './models/dto/updateSectionsDisplayOrder.dto'

@ApiTags('sections')
@Controller({ path: 'sections', version: ['1', VERSION_NEUTRAL] })
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  create(@Body() createSectionDto: CreateSectionDto): Promise<SectionDto> {
    return this.sectionsService.create(createSectionDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.sectionsService.delete(id)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<SectionDto> {
    return await this.sectionsService.update(id, updateSectionDto)
  }

  @Put()
  @Documentation({
    description: 'Update display order of sections',
    response: { status: 204 },
  })
  async updateDisplayOrder(
    @Body() updateSectionsDisplayOrderDto: UpdateSectionsDisplayOrderDto,
  ): Promise<void> {
    return this.sectionsService.updateDisplayOrder(
      updateSectionsDisplayOrderDto,
    )
  }
}
