import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ListItem } from './models/listItem.model'
import { ListItemDto } from './models/dto/listItem.dto'
import { CreateListItemDto } from './models/dto/createListItem.dto'
import { UpdateListItemDto } from './models/dto/updateListItem.dto'
import { UpdateListItemsDisplayOrderDto } from './models/dto/updateListItemsDisplayOrder.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

@Injectable()
export class ListItemsService {
  constructor(
    @InjectModel(ListItem)
    private readonly listItemModel: typeof ListItem,
  ) {}

  async findById(id: string): Promise<ListItem> {
    const listItem = await this.listItemModel.findByPk(id)

    if (!listItem) {
      throw new NotFoundException(`List item with id '${id}' not found`)
    }

    return listItem
  }

  async create(createListItem: CreateListItemDto): Promise<ListItemDto> {
    const newListItem = await this.listItemModel.create({
      fieldId: createListItem.fieldId,
      displayOrder: createListItem.displayOrder,
    } as ListItem)

    const keys = [
      'id',
      'label',
      'description',
      'value',
      'displayOrder',
      'isSelected',
    ]
    const listItemDto: ListItemDto = defaults(
      pick(newListItem, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as ListItemDto

    return listItemDto
  }

  async update(
    id: string,
    updateListItemDto: UpdateListItemDto,
  ): Promise<void> {
    const listItem = await this.findById(id)

    Object.assign(listItem, updateListItemDto)

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
