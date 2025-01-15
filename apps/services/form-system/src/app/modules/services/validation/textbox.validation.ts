import { BadRequestException } from '@nestjs/common'
import { FieldDto } from '../../fields/models/dto/field.dto'
import { FieldValidation } from '../../../dataTypes/validationResponse.model'

export class TextboxValidation {
  static validate(field: FieldDto): FieldValidation {
    const { isRequired, fieldSettings } = field
    const fieldValidation = new FieldValidation()
    fieldValidation.isValid = true

    field.values?.forEach((value) => {
      const { json } = value

      if (!json) {
        throw new BadRequestException(`Json is required`)
      }

      if (!fieldSettings) {
        throw new BadRequestException(`Field settings are required`)
      }

      if (isRequired && !json.text) {
        fieldValidation.isValid = false
        fieldValidation.values.push({
          isValid: false,
          valueId: value.id,
          message: {
            is: `Fylla þarf út þennan reit`,
            en: `Value is required`,
          },
        })
      } else if (
        fieldSettings?.minLength &&
        json.text &&
        json.text.length < fieldSettings.minLength
      ) {
        fieldValidation.isValid = false
        fieldValidation.values.push({
          isValid: false,
          valueId: value.id,
          message: {
            is: `Textinn þarf að vera lengri en ${fieldSettings.minLength} stafir`,
            en: `The text needs to be longer than ${fieldSettings.minLength} characters`,
          },
        })
      } else if (
        fieldSettings?.maxLength &&
        json.text &&
        json.text.length > fieldSettings.maxLength
      ) {
        fieldValidation.isValid = false
        fieldValidation.values.push({
          isValid: false,
          valueId: value.id,
          message: {
            is: `Textinn þarf að vera styttri en ${fieldSettings.minLength} stafir`,
            en: `The text needs to be shorter than ${fieldSettings.minLength} characters`,
          },
        })
      }
    })

    return fieldValidation
  }
}
