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
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Section } from '../sections/models/section.model'
import { Form } from '../forms/models/form.model'
import { Field } from '../fields/models/field.model'
import { Screen } from '../screens/models/screen.model'

@Injectable()
export class ListItemsService {
  constructor(
    @InjectModel(ListItem)
    private readonly listItemModel: typeof ListItem,
    @InjectModel(Field)
    private readonly fieldModel: typeof Field,
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
  ) {}

  async create(
    user: User,
    createListItem: CreateListItemDto,
  ): Promise<ListItemDto> {
    await this.checkPermissions(user, createListItem.fieldId)

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
    user: User,
    id: string,
    updateListItemDto: UpdateListItemDto,
  ): Promise<void> {
    const listItem = await this.listItemModel.findByPk(id)

    if (!listItem) {
      throw new NotFoundException(`List item with id '${id}' not found`)
    }

    await this.checkPermissions(user, listItem.fieldId)

    Object.assign(listItem, updateListItemDto)

    await listItem.save()
  }

  async updateDisplayOrder(
    user: User,
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

      await this.checkPermissions(user, listItem.fieldId)

      await listItem.update({
        displayOrder: i,
      })
    }
  }

  async delete(user: User, id: string): Promise<void> {
    const listItem = await this.listItemModel.findByPk(id)

    if (!listItem) {
      throw new NotFoundException(`List item with id '${id}' not found`)
    }

    await this.checkPermissions(user, listItem.fieldId)

    await listItem.destroy()
  }

  private async checkPermissions(user: User, fieldId: string): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const field = await this.fieldModel.findByPk(fieldId)
    if (!field) {
      throw new NotFoundException(`Field with id '${fieldId}' not found`)
    }
    const screen = await this.screenModel.findByPk(field.screenId)
    if (!screen) {
      throw new NotFoundException(
        `Screen with id '${field.screenId}' not found`,
      )
    }
    const section = await this.sectionModel.findByPk(screen.sectionId)
    if (!section) {
      throw new NotFoundException(
        `Section with id '${screen.sectionId}' not found`,
      )
    }
    const form = await this.formModel.findByPk(section.formId)
    if (!form) {
      throw new NotFoundException(`Form with id '${section.formId}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new NotFoundException(
        `User does not have permission to manage list items of field with id '${fieldId}'`,
      )
    }
  }
}
