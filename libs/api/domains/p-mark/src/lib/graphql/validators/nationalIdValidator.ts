import { registerDecorator, ValidationOptions } from 'class-validator'
import { isPerson } from 'kennitala'

// Copy/paste from services-endorsements-api

export const IsNationalId = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsNationalId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} contains an invalid national id for a person`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' && isPerson(value) && value.length === 10
          )
        },
      },
    })
  }
}
