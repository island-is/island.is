import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Put,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ScreensService } from './screens.service'
import { CreateScreenDto } from './models/dto/createScreen.dto'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'
import { UpdateScreenDto } from './models/dto/updateScreen.dto'
import { ScreenDto } from './models/dto/screen.dto'
import { UpdateScreensDisplayOrderDto } from './models/dto/updateScreensDisplayOrder.dto'

@ApiTags('screens')
@Controller({ path: 'screens', version: ['1', VERSION_NEUTRAL] })
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Post()
  create(@Body() createScreenDto: CreateScreenDto): Promise<ScreenDto> {
    return this.screensService.create(createScreenDto)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScreenDto: UpdateScreenDto,
  ): Promise<ScreenDto> {
    return await this.screensService.update(id, updateScreenDto)
  }

  @Put()
  @Documentation({
    description: 'Update display order of screens',
    response: { status: 204 },
  })
  async updateDisplayOrder(
    @Body() updateScreensDisplayOrderDto: UpdateScreensDisplayOrderDto,
  ): Promise<void> {
    return this.screensService.updateDisplayOrder(updateScreensDisplayOrderDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.screensService.delete(id)
  }
}
