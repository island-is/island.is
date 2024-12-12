import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Value } from './models/value.model'
import { UpdateValueDto } from './models/dto/updateValue.dto'
import { CreateValueDto } from './models/dto/createValue.dto'
import { FieldTypesEnum } from '../../dataTypes/fieldTypes/fieldTypes.enum'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'
import { ApplicationEvents } from '../../enums/applicationEvents'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { Field } from '../fields/models/field.model'
import { fi } from 'date-fns/locale'
import { TextboxValidation } from './validation/textbox.validation'

@Injectable()
export class ValuesService {
  constructor(
    @InjectModel(Value)
    private readonly valueModel: typeof Value,
    @InjectModel(ApplicationEvent)
    private readonly applicationEventModel: typeof ApplicationEvent,
    @InjectModel(Field)
    private readonly fieldModel: typeof Field,
  ) {}

  async create(createValueDto: CreateValueDto): Promise<string> {
    if (createValueDto.order === 0) {
      throw new PreconditionFailedException(`order of new value cannot be 0`)
    }

    const newValue: Value = new this.valueModel(createValueDto as Value)
    await newValue.save()

    return newValue.id
  }

  async update(id: string, updateValueDto: UpdateValueDto): Promise<void> {
    const value = await this.valueModel.findByPk(id)

    if (!value) {
      throw new NotFoundException(`Value with id '${id}' not found`)
    }

    const field = await this.fieldModel.findByPk(value.fieldId)

    if (!field) {
      throw new NotFoundException(`Field with id '${value.fieldId}' not found`)
    }

    const validationPassed = this.validateValue(updateValueDto.json, field)

    value.json = updateValueDto.json

    await value.save()

    if (value.fieldType === FieldTypesEnum.FILE) {
      await this.applicationEventModel.create({
        eventType: ApplicationEvents.FILE_CREATED,
        applicationId: value.applicationId,
        isFileEvent: true,
        valueId: value.id,
      } as ApplicationEvent)
    }
  }

  async delete(id: string): Promise<void> {
    const value = await this.valueModel.findByPk(id)

    if (!value) {
      throw new NotFoundException(`Value with id '${id}' not found`)
    }

    if (value.order === 0) {
      throw new PreconditionFailedException(
        `Value with id '${id}' cannot be deleted`,
      )
    }

    value.destroy()
  }

  private validateValue(json: ValueType, field: Field): boolean {
    const { isRequired, fieldSettings, fieldType } = field

    if (!fieldSettings || !json) {
      return true
    }

    switch (fieldType) {
      case FieldTypesEnum.TEXTBOX:
        return TextboxValidation.validate(json, isRequired, fieldSettings)
      case FieldTypesEnum.NUMBERBOX:
        return true
      case FieldTypesEnum.MESSAGE:
        return true
      case FieldTypesEnum.HOMESTAY_OVERVIEW:
        return true
      case FieldTypesEnum.HOMESTAY_NUMBER:
        return true
      case FieldTypesEnum.CANDITATE:
        return true
      case FieldTypesEnum.DATE_PICKER:
        return true
      case FieldTypesEnum.DROPDOWN_LIST:
        return true
      case FieldTypesEnum.RADIO_BUTTONS:
        return true
      case FieldTypesEnum.EMAIL:
        return true
      case FieldTypesEnum.PROPERTY_NUMBER:
        return true
      case FieldTypesEnum.ISK_NUMBERBOX:
        return true
      case FieldTypesEnum.ISK_SUMBOX:
        return true
      case FieldTypesEnum.CHECKBOX:
        return true
      case FieldTypesEnum.PAYER:
        return true
      case FieldTypesEnum.NATIONAL_ID:
        return true
      case FieldTypesEnum.NATIONAL_ID_ESTATE:
        return true
      case FieldTypesEnum.NATIONAL_ID_ALL:
        return true
      case FieldTypesEnum.PHONE_NUMBER:
        return true
      case FieldTypesEnum.BANK_ACCOUNT:
        return true
      case FieldTypesEnum.TIME_INPUT:
        return true
      case FieldTypesEnum.FILE:
        return true
      default:
        return false
    }

    // if (fieldType === FieldTypesEnum.TEXTBOX) {

    // }

    // console.log(JSON.stringify(json, null, 2))

    // return false
  }
}
