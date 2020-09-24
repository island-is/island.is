import { registerEnumType } from '@nestjs/graphql'

export enum ContentLanguage {
  is = 'is',
  en = 'en',
}

registerEnumType(ContentLanguage, { name: 'ContentLanguage' })
