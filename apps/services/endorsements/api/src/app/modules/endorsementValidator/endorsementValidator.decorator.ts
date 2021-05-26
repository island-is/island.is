import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  validate,
} from 'class-validator'
import { ValidationRule } from './endorsementValidator.service'
import { MinAgeInputType } from './validators/minAge/minAgeValidator.service'
import { MinAgeByDateInputType } from './validators/minAgeByDate/minAgeByDateValidator.service'
import { UniqueWithinTagsInputType } from './validators/uniqueWithinTags/uniqueWithinTagsValidator.service'

const validatorInputTypes = {
  [ValidationRule.MIN_AGE]: MinAgeInputType,
  [ValidationRule.MIN_AGE_AT_DATE]: MinAgeByDateInputType,
  [ValidationRule.UNIQUE_WITHIN_TAGS]: UniqueWithinTagsInputType,
}

export const IsEndorsementValidator = (
  validationOptions?: ValidationOptions,
) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsEndorsementValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} in field validationRules is not a valid endorsement validator input`,
        ...validationOptions,
      },
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const validatorType = (args.object as any)['type'] as ValidationRule

          // so we don't crash when validator type is wrong
          const Validator = validatorInputTypes[validatorType]
          if (!Validator) {
            return false
          }

          const validator: any = new Validator()

          // assign values to validation object
          Object.entries(value).forEach(([fieldName, fieldValue]) => {
            validator[fieldName] = fieldValue
          })

          // if we have no validation errors we allow this value
          const validationErrors = await validate(validator)
          if (validationErrors.length === 0) {
            return true
          }

          return false
        },
      },
    })
  }
}
