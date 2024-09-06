import { registerDecorator, ValidationOptions } from 'class-validator'
import { isPerson } from 'kennitala'

export const IsPersonNationalId = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsPersonNationalId',
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
