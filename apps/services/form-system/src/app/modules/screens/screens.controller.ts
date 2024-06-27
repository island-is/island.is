import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common'
import { ScreensService } from './screens.service'
import { CreateScreenDto } from './models/dto/createScreen.dto'
import { Screen } from './models/screen.model'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'
import { UpdateScreenDto } from './models/dto/updateScreen.dto'
import { ScreenDto } from './models/dto/screen.dto'
import { UpdateScreensDisplayOrderDto } from './models/dto/updateScreensDisplayOrder.dto'

@ApiTags('screens')
@Controller('screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Post()
  create(@Body() createScreenDto: CreateScreenDto): Promise<Screen> {
    return this.screensService.create(createScreenDto)
  }

  @Get()
  @Documentation({
    description: 'Get all Screens',
    response: { status: 200, type: [Screen] },
  })
  async findAll(): Promise<Screen[]> {
    return await this.screensService.findAll()
  }

  @Get(':id')
  @Documentation({
    description: 'Get Screen by id',
    response: { status: 200, type: Screen },
  })
  async findOne(@Param('id') id: string): Promise<Screen> {
    const screen = await this.screensService.findOne(id)
    if (!screen) {
      throw new NotFoundException(`Screen not found`)
    }

    return screen
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
