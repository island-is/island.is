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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { UpdateScreenDto } from './models/dto/updateScreen.dto'
import { ScreenDto } from './models/dto/screen.dto'
import { UpdateScreensDisplayOrderDto } from './models/dto/updateScreensDisplayOrder.dto'

@ApiTags('screens')
@Controller({ path: 'screens', version: ['1', VERSION_NEUTRAL] })
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @ApiOperation({ summary: 'Creates a new screen' })
  @ApiCreatedResponse({
    description: 'Creates a new screen',
    type: ScreenDto,
  })
  @ApiBody({ type: CreateScreenDto })
  @Post()
  create(@Body() createScreenDto: CreateScreenDto): Promise<ScreenDto> {
    return this.screensService.create(createScreenDto)
  }

  @ApiOperation({ summary: 'Updates screen' })
  @ApiCreatedResponse({
    description: 'Updates a screen',
    type: ScreenDto,
  })
  @ApiBody({ type: UpdateScreenDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScreenDto: UpdateScreenDto,
  ): Promise<ScreenDto> {
    return await this.screensService.update(id, updateScreenDto)
  }

  @ApiOperation({ summary: 'Update display order of screens' })
  @ApiNoContentResponse({
    description: 'Update display order of screens',
  })
  @ApiBody({ type: UpdateScreensDisplayOrderDto })
  @Put()
  async updateDisplayOrder(
    @Body() updateScreensDisplayOrderDto: UpdateScreensDisplayOrderDto,
  ): Promise<void> {
    return this.screensService.updateDisplayOrder(updateScreensDisplayOrderDto)
  }

  @ApiOperation({ summary: 'Delete screen by id' })
  @ApiNoContentResponse({
    description: 'Delete screen by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.screensService.delete(id)
  }
}
