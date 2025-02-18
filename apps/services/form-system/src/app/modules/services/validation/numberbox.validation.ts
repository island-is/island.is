import { FieldSettings, ValueType } from '@island.is/form-system-dataTypes'
import { BadRequestException } from '@nestjs/common'

export class NumberboxValidation {
  static validate(
    json: ValueType,
    isRequired: boolean,
    fieldSettings: FieldSettings,
  ): boolean {
    const validationPassed = false

    if (isRequired && (!json || !json.number)) {
      throw new BadRequestException(`Value is required`)
    }

    if (
      fieldSettings?.minValue &&
      json.number &&
      json.number < fieldSettings.minValue
    ) {
      throw new BadRequestException(
        `Value is less than ${fieldSettings.minLength} characters`,
      )
    }

    if (
      fieldSettings?.maxValue &&
      json.number &&
      json.number > fieldSettings.maxValue
    ) {
      throw new BadRequestException(
        `Value is longer than ${fieldSettings.maxLength} characters`,
      )
    }

    return validationPassed
  }
}
