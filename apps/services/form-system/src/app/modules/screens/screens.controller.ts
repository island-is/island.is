import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Put,
  VERSION_NEUTRAL,
  UseGuards,
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
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
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
  create(
    @CurrentUser() user: User,
    @Body() createScreenDto: CreateScreenDto,
  ): Promise<ScreenDto> {
    return this.screensService.create(user, createScreenDto)
  }

  @ApiOperation({ summary: 'Update screen' })
  @ApiNoContentResponse({
    description: 'Update screen',
  })
  @ApiBody({ type: UpdateScreenDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScreenDto: UpdateScreenDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.screensService.update(user, id, updateScreenDto)
  }

  @ApiOperation({ summary: 'Update display order of screens' })
  @ApiNoContentResponse({
    description: 'Update display order of screens',
  })
  @ApiBody({ type: UpdateScreensDisplayOrderDto })
  @Put()
  async updateDisplayOrder(
    @Body() updateScreensDisplayOrderDto: UpdateScreensDisplayOrderDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.screensService.updateDisplayOrder(
      user,
      updateScreensDisplayOrderDto,
    )
  }

  @ApiOperation({ summary: 'Delete screen by id' })
  @ApiNoContentResponse({
    description: 'Delete screen by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.screensService.delete(user, id)
  }
}
