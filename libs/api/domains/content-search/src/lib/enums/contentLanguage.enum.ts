import { registerEnumType } from '@nestjs/graphql'

export enum ContentLanguage {
  is = 'is',
  en = 'is',
}

registerEnumType(ContentLanguage, { name: 'ContentLanguage' })
