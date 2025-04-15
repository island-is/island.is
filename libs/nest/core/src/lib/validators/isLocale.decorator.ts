import { registerDecorator, ValidationOptions } from 'class-validator'
import { supportedLocales } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'

export const IsLocale = (validationOptions?: ValidationOptions) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsLocale',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `Invalid locale supplied. Must be any of the following: „${supportedLocales.join(
          '“, „',
        )}“`,
        ...validationOptions,
      },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate(value: any) {
          return (
            typeof value === 'string' &&
            supportedLocales.includes(value as Locale)
          )
        },
      },
    })
  }
}
