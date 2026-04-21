import { registerEnumType } from '@nestjs/graphql'

export enum LocaleEnum {
  Is = 'is',
  En = 'en',
}

registerEnumType(LocaleEnum, {
  name: 'Locale',
  description: 'Available locales',
})
