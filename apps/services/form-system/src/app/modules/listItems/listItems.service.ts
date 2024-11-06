import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ListItem } from './models/listItem.model'
import { ListItemDto } from './models/dto/listItem.dto'
import { CreateListItemDto } from './models/dto/createListItem.dto'
// import { FieldSettingsService } from '../fieldSettings/fieldSettings.service'
import { ListItemMapper } from './models/listItem.mapper'
import { UpdateListItemDto } from './models/dto/updateListItem.dto'
import { UpdateListItemsDisplayOrderDto } from './models/dto/updateListItemsDisplayOrder.dto'

@Injectable()
export class ListItemsService {
  constructor(
    @InjectModel(ListItem)
    private readonly listItemModel: typeof ListItem,
    // private readonly fieldSettingsService: FieldSettingsService,
    private listItemMapper: ListItemMapper,
  ) {}

  async findById(id: string): Promise<ListItem> {
    const listItem = await this.listItemModel.findByPk(id)

    if (!listItem) {
      throw new NotFoundException(`List item with id '${id}' not found`)
    }

    return listItem
  }

  async create(createListItem: CreateListItemDto): Promise<ListItemDto> {
    // const fieldSettings = await this.fieldSettingsService.findByFieldId(
    //   createListItem.fieldId,
    // )

    const listItem = await this.listItemModel.create({
      fieldId: createListItem.fieldId,
      displayOrder: createListItem.displayOrder,
    } as ListItem)

    return this.listItemMapper.mapListItemToListItemDto(listItem)
  }

  async update(
    id: string,
    updateListItemDto: UpdateListItemDto,
  ): Promise<void> {
    const listItem = await this.findById(id)

    this.listItemMapper.mapUpdateListItemDtoToListItem(
      listItem,
      updateListItemDto,
    )
    listItem.modified = new Date()

    await listItem.save()
  }

  async updateDisplayOrder(
    updateListItemsDisplayOrderDto: UpdateListItemsDisplayOrderDto,
  ): Promise<void> {
    const { listItemsDisplayOrderDto } = updateListItemsDisplayOrderDto

    for (let i = 0; i < listItemsDisplayOrderDto.length; i++) {
      const listItem = await this.listItemModel.findByPk(
        listItemsDisplayOrderDto[i].id,
      )

      if (!listItem) {
        throw new NotFoundException(
          `List item with id '${listItemsDisplayOrderDto[i].id}' not found`,
        )
      }

      await listItem.update({
        displayOrder: i,
      })
    }
  }

  async delete(id: string): Promise<void> {
    const listItem = await this.findById(id)
    listItem?.destroy()
  }
}
