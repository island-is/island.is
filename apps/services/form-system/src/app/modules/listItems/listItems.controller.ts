import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  VERSION_NEUTRAL,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ListItemsService } from './listItems.service'
import { CreateListItemDto } from './models/dto/createListItem.dto'
import { ListItemDto } from './models/dto/listItem.dto'
import { UpdateListItemDto } from './models/dto/updateListItem.dto'
import { UpdateListItemsDisplayOrderDto } from './models/dto/updateListItemsDisplayOrder.dto'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
@ApiTags('list items')
@Controller({ path: 'listItems', version: ['1', VERSION_NEUTRAL] })
export class ListItemsController {
  constructor(private readonly listItemsService: ListItemsService) {}

  @ApiOperation({ summary: 'Create a list item' })
  @ApiCreatedResponse({
    description: 'Create a list item',
    type: ListItemDto,
  })
  @ApiBody({ type: CreateListItemDto })
  @Post()
  create(@Body() createListItem: CreateListItemDto): Promise<ListItemDto> {
    return this.listItemsService.create(createListItem)
  }

  @ApiOperation({ summary: 'Update list item' })
  @ApiNoContentResponse({
    description: 'Update list item',
  })
  @ApiBody({ type: UpdateListItemDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateListItemDto: UpdateListItemDto,
  ): Promise<void> {
    return this.listItemsService.update(id, updateListItemDto)
  }

  @ApiOperation({ summary: 'Delete list item' })
  @ApiNoContentResponse({
    description: 'Delete of list items',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.listItemsService.delete(id)
  }

  @ApiOperation({ summary: 'Update display order of list items' })
  @ApiNoContentResponse({
    description: 'Update display order of list items',
  })
  @ApiBody({ type: UpdateListItemsDisplayOrderDto })
  @Put()
  async updateDisplayOrder(
    @Body() updateListItemsDisplayOrderDto: UpdateListItemsDisplayOrderDto,
  ): Promise<void> {
    return this.listItemsService.updateDisplayOrder(
      updateListItemsDisplayOrderDto,
    )
  }
}
