import { Injectable } from '@nestjs/common'
import { ListItem } from './listItem.model'
import { ListItemDto } from './dto/listItem.dto'
import { UpdateListItemDto } from './dto/updateListItem.dto'

@Injectable()
export class ListItemMapper {
  mapListItemsToListItemsDto(listItems: ListItem[]): ListItemDto[] {
    const listItemsDto: ListItemDto[] = listItems.map((listItem) => {
      return {
        id: listItem.id,
        label: listItem.label,
        description: listItem.description,
        value: listItem.value,
        displayOrder: listItem.displayOrder,
        isSelected: listItem.isSelected,
      } as ListItemDto
    })
    return listItemsDto
  }

  mapListItemToListItemDto(listItem: ListItem): ListItemDto {
    const listItemDto: ListItemDto = {
      id: listItem.id,
      label: listItem.label,
      description: listItem.description,
      value: listItem.value,
      displayOrder: listItem.displayOrder,
      isSelected: listItem.isSelected,
    }

    return listItemDto
  }

  mapUpdateListItemDtoToListItem(
    listItem: ListItem,
    updateListItemDto: UpdateListItemDto,
  ): void {
    listItem.label = updateListItemDto.label
    listItem.description = updateListItemDto.description
    listItem.value = updateListItemDto.value
    listItem.isSelected = updateListItemDto.isSelected
  }
}
