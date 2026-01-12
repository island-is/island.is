import { Injectable } from '@nestjs/common'
import {
  FieldValidation,
  ScreenValidationResponse,
} from '../../dataTypes/validationResponse.model'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { FieldTypesEnum } from '@island.is/form-system/shared'
import { TextboxValidation } from './validation/textbox.validation'
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
    })

    return screenValidationResponse
  }

  private validateValue(field: FieldDto): FieldValidation {
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
      case FieldTypesEnum.CANDIDATE:
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
