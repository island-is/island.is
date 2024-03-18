import { registerDecorator, ValidationOptions } from 'class-validator'
import { IsoCountryCodeValidator } from '../validators/isCountryCode.validator'

export const IsIsoCountryCode = (validationOptions?: ValidationOptions) => {
  return (target: object, propertyName: string) => {
    registerDecorator({
      name: 'IsIsoCountryCode',
      target: target.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid ISO 3166-1 alpha-2 country code`,
        ...validationOptions,
      },
      validator: IsoCountryCodeValidator,
    })
  }
}
