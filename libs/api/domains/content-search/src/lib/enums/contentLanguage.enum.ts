import { registerEnumType } from '@nestjs/graphql'

export enum ContentLanguage {
  is,
  en,
}

registerEnumType(ContentLanguage, { name: 'ContentLanguage' })
