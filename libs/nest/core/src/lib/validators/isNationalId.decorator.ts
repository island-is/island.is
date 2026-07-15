import { registerDecorator, ValidationOptions } from 'class-validator'
import { isValid } from 'kennitala'

export const IsNationalId = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsNationalId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} contains an invalid national id for a person or a company`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' && isValid(value) && value.length === 10
          )
        },
      },
    })
  }
}
