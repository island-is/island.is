import { BadRequestException } from '@nestjs/common'
import { ValueType } from '../../../dataTypes/valueTypes/valueType.model'
import { FieldSettings } from '../../../dataTypes/fieldSettings/fieldSettings.model'

export class TextboxValidation {
  static validate(
    json: ValueType,
    isRequired: boolean,
    fieldSettings: FieldSettings,
  ): boolean {
    const validationPassed = false

    if (isRequired && !json) {
      throw new BadRequestException(`Value is required`)
    }

    if (
      fieldSettings?.minLength &&
      json.text &&
      json.text.length < fieldSettings.minLength
    ) {
      throw new BadRequestException(
        `Value is shorter than ${fieldSettings.minLength} characters`,
      )
    }
    if (
      fieldSettings?.maxLength &&
      json.text &&
      json.text.length > fieldSettings.maxLength
    ) {
      throw new BadRequestException(
        `Value is longer than ${fieldSettings.maxLength} characters`,
      )
    }
    return validationPassed
  }
}
