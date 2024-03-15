import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { isPerson } from 'kennitala'

@ValidatorConstraint({ async: false })
class NationalIdValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return typeof value === 'string' && isPerson(value) && value.length === 10
  }

  defaultMessage(): string {
    return `Contains an invalid national id for a person`
  }
}

export const IsNationalId = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsNationalId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} contains an invalid national id for a person`,
        ...validationOptions,
      },
      validator: NationalIdValidator,
    })
  }
}
