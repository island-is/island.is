import { Injectable } from '@nestjs/common'
import {
  FieldValidation,
  ScreenValidationResponse,
} from '../../dataTypes/validationResponse.model'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { FieldTypesEnum } from '../../dataTypes/fieldTypes/fieldTypes.enum'
import { TextboxValidation } from './validation/textbox.validation'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { Field } from '../fields/models/field.model'
import { FieldDto } from '../fields/models/dto/field.dto'

@Injectable()
export class ValidationService {
  async validateScreen(
    screenDto: ScreenDto,
  ): Promise<ScreenValidationResponse> {
    const screenValidationResponse: ScreenValidationResponse =
      new ScreenValidationResponse()
    screenValidationResponse.isValid = true

    screenDto.fields?.forEach((field) => {
      const fieldValidation = this.validateValue(field)

      if (!fieldValidation.isValid) {
        screenValidationResponse.isValid = false
        screenValidationResponse.fields.push(fieldValidation)
      }
      // if (!isValid) {
      //   screenValidationResponse.isValid = false
      //   screenValidationResponse.fields.push({
      //     isValid: false,
      //     fieldId: field.id,
      //     message: {
      //       en: `Validation failed for field ${field.id}`,
      //       is: `Validation failed for field ${field.id}`,
      //     },
      //   })
      //   screenValidationResponse.values.push({
      //     isValid: false,
      //     valueId: value.id,
      //     message: {
      //       en: `Validation failed for value ${value.id}`,
      //       is: `Validation failed for value ${value.id}`,
      //     },
      //   })
      // }
    })

    // screenDto.fields?.forEach((field) => {
    //   field.values?.forEach((value) => {
    //     const isValid = this.validateValue(value.json, field)
    //     if (!isValid) {
    //       screenValidationResponse.isValid = false
    //       screenValidationResponse.errors.push({
    //         fieldId: field.id,
    //         message: `Validation failed for field ${field.id}`,
    //   })
    // }})}

    // screenDto.fields.forEach((field) => {
    //   const { json } = field
    //   const isValid = this.validateValue(json, field)
    //   if (!isValid) {
    //     screenValidationResponse.isValid = false
    //     screenValidationResponse.errors.push({
    //       fieldId: field.id,
    //       message: `Validation failed for field ${field.id}`,
    //     })
    //   }
    // })

    return screenValidationResponse
  }

  private validateValue(field: FieldDto): FieldValidation {
    // const { isRequired, fieldSettings, fieldType } = field

    switch (field.fieldType) {
      case FieldTypesEnum.TEXTBOX:
        return TextboxValidation.validate(field)
      case FieldTypesEnum.NUMBERBOX:
        return new FieldValidation()
      case FieldTypesEnum.MESSAGE:
        return new FieldValidation()
      case FieldTypesEnum.HOMESTAY_OVERVIEW:
        return new FieldValidation()
      case FieldTypesEnum.HOMESTAY_NUMBER:
        return new FieldValidation()
      case FieldTypesEnum.CANDITATE:
        return new FieldValidation()
      case FieldTypesEnum.DATE_PICKER:
        return new FieldValidation()
      case FieldTypesEnum.DROPDOWN_LIST:
        return new FieldValidation()
      case FieldTypesEnum.RADIO_BUTTONS:
        return new FieldValidation()
      case FieldTypesEnum.EMAIL:
        return new FieldValidation()
      case FieldTypesEnum.PROPERTY_NUMBER:
        return new FieldValidation()
      case FieldTypesEnum.ISK_NUMBERBOX:
        return new FieldValidation()
      case FieldTypesEnum.ISK_SUMBOX:
        return new FieldValidation()
      case FieldTypesEnum.CHECKBOX:
        return new FieldValidation()
      case FieldTypesEnum.PAYER:
        return new FieldValidation()
      case FieldTypesEnum.NATIONAL_ID:
        return new FieldValidation()
      case FieldTypesEnum.NATIONAL_ID_ESTATE:
        return new FieldValidation()
      case FieldTypesEnum.NATIONAL_ID_ALL:
        return new FieldValidation()
      case FieldTypesEnum.PHONE_NUMBER:
        return new FieldValidation()
      case FieldTypesEnum.BANK_ACCOUNT:
        return new FieldValidation()
      case FieldTypesEnum.TIME_INPUT:
        return new FieldValidation()
      case FieldTypesEnum.FILE:
        return new FieldValidation()
      default:
        return new FieldValidation()
    }
  }
}
