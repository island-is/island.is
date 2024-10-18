import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ListItemsService } from './listItems.service'
import { CreateListItemDto } from './models/dto/createListItem.dto'
import { ListItemDto } from './models/dto/listItem.dto'
import { UpdateListItemDto } from './models/dto/updateListItem.dto'
import { UpdateListItemsDisplayOrderDto } from './models/dto/updateListItemsDisplayOrder.dto'
import { Documentation } from '@island.is/nest/swagger'

@ApiTags('list items')
@Controller({ path: 'listItems', version: ['1', VERSION_NEUTRAL] })
export class ListItemsController {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Post()
  create(@Body() createListItem: CreateListItemDto): Promise<ListItemDto> {
    return this.listItemsService.create(createListItem)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateListItemDto: UpdateListItemDto,
  ): Promise<void> {
    return this.listItemsService.update(id, updateListItemDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.listItemsService.delete(id)
  }

  @Put()
  @Documentation({
    description: 'Update display order of list items',
    response: { status: 204 },
  })
  async updateDisplayOrder(
    @Body() updateListItemsDisplayOrderDto: UpdateListItemsDisplayOrderDto,
  ): Promise<void> {
    return this.listItemsService.updateDisplayOrder(
      updateListItemsDisplayOrderDto,
    )
  }
}
