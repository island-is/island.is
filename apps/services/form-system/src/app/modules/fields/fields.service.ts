import { FieldTypesEnum } from '@island.is/form-system/shared'
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import {
  filterDependency,
  filterOnlyParents,
} from '../../../utils/dependenciesHelper'
import { FieldSettingsFactory } from '../../dataTypes/fieldSettings/fieldSettings.factory'
import { FieldSettings } from '../../dataTypes/fieldSettings/fieldSettings.model'
import { Form } from '../forms/models/form.model'
import { Screen } from '../screens/models/screen.model'
import { Section } from '../sections/models/section.model'
import { CreateFieldDto } from './models/dto/createField.dto'
import { FieldDto } from './models/dto/field.dto'
import { UpdateFieldDto } from './models/dto/updateField.dto'
import { UpdateFieldsDisplayOrderDto } from './models/dto/updateFieldsDisplayOrder.dto'
import { Field } from './models/field.model'
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@Injectable()
export class FieldsService {
  constructor(
    @InjectModel(Field)
    private readonly fieldModel: typeof Field,
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
  ) {}

  async findById(id: string): Promise<Field> {
    const field = await this.fieldModel.findByPk(id)

    if (!field) {
      throw new NotFoundException(`Field with id '${id}' not found`)
    }

    return field
  }

  async create(user: User, createFieldDto: CreateFieldDto): Promise<FieldDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const { screenId, fieldType, displayOrder } = createFieldDto

    const screen = await this.screenModel.findByPk(screenId, {
      attributes: ['sectionId'],
      raw: true,
    })

    const section = await this.sectionModel.findByPk(screen?.sectionId, {
      attributes: ['formId'],
      raw: true,
    })

    const form = await this.formModel.findByPk(section?.formId, {
      attributes: ['organizationNationalId'],
      raw: true,
    })

    const formOwnerNationalId = form?.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User with nationalId '${user.nationalId}' does not have permission to create field for screen with id '${screenId}'`,
      )
    }

    const newField: Field = await this.fieldModel.create({
      screenId: screenId,
      fieldType: fieldType,
      displayOrder: displayOrder,
      fieldSettings: FieldSettingsFactory.getClass(
        fieldType,
        new FieldSettings(),
      ),
    } as Field)

    const keys = [
      'id',
      'identifier',
      'screenId',
      'name',
      'displayOrder',
      'description',
      'isPartOfMultiset',
      'isRequired',
      'fieldType',
      'fieldSettings',
    ]
    const fieldDto: FieldDto = defaults(
      pick(newField, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as FieldDto

    return fieldDto
  }

  async update(
    user: User,
    id: string,
    updateFieldDto: UpdateFieldDto,
  ): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const field = await this.findById(id)
    const currentFieldType = field.fieldType

    if (
      currentFieldType === FieldTypesEnum.DROPDOWN_LIST ||
      currentFieldType === FieldTypesEnum.RADIO_BUTTONS ||
      currentFieldType === FieldTypesEnum.CHECKBOX
    ) {
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
        throw new NotFoundException(
          `Form with id '${section.formId}' not found`,
        )
      }

      const formOwnerNationalId = form.organizationNationalId
      if (user.nationalId !== formOwnerNationalId && !isAdmin) {
        throw new UnauthorizedException(
          `User with nationalId '${user.nationalId}' does not have permission to update field with id '${id}'`,
        )
      }

      let listItemIds: string[] = []

      if (
        currentFieldType === FieldTypesEnum.DROPDOWN_LIST ||
        currentFieldType === FieldTypesEnum.RADIO_BUTTONS
      ) {
        listItemIds = field.list?.map((item) => item.id) || []
        // TODO: listItems should be deleted from the database as well
      }

      const { dependencies } = form
      const ids = listItemIds.length > 0 ? listItemIds : id
      const newDependencies = filterOnlyParents(dependencies, ids)
      form.dependencies = newDependencies
      form.save()
    }

    Object.assign(field, updateFieldDto)

    await field.save()
  }

  async updateDisplayOrder(
    user: User,
    updateFieldsDisplayOrderDto: UpdateFieldsDisplayOrderDto,
  ): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const { fieldsDisplayOrderDto } = updateFieldsDisplayOrderDto

    for (let i = 0; i < fieldsDisplayOrderDto.length; i++) {
      const field = await this.fieldModel.findByPk(fieldsDisplayOrderDto[i].id)

      if (!field) {
        throw new NotFoundException(
          `Field with id '${fieldsDisplayOrderDto[i].id}' not found`,
        )
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
        throw new NotFoundException(
          `Form with id '${section.formId}' not found`,
        )
      }

      const formOwnerNationalId = form.organizationNationalId
      if (user.nationalId !== formOwnerNationalId && !isAdmin) {
        throw new UnauthorizedException(
          `User with nationalId '${user.nationalId}' does not have permission to update display order of field with id '${field.id}'`,
        )
      }

      await field.update({
        displayOrder: i,
        screenId: fieldsDisplayOrderDto[i].screenId,
      })
    }
  }

  async delete(user: User, id: string): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const field = await this.findById(id)

    if (!field) {
      throw new NotFoundException(`Field with id '${id}' not found`)
    }
    // Make sure to delete all instances of the fieldId in the dependencies array

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
      throw new UnauthorizedException(
        `User with nationalId '${user.nationalId}' does not have permission to delete field with id '${id}'`,
      )
    }

    let listItemIds: string[] = []

    if (
      field.fieldType === FieldTypesEnum.DROPDOWN_LIST ||
      field.fieldType === FieldTypesEnum.RADIO_BUTTONS
    ) {
      // If the field is a dropdown or radio buttons, we need to remove any dependencies that reference its options
      listItemIds = field.list?.map((item) => item.id) || []
    }

    const { dependencies } = form
    const idsToRemove = listItemIds.length > 0 ? listItemIds : id
    const newDependencies = filterDependency(dependencies, idsToRemove)
    form.dependencies = newDependencies
    form.save()

    field?.destroy()
  }
}
