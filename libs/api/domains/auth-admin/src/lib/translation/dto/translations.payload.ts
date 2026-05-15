import { Field, Int, ObjectType } from '@nestjs/graphql'

import { TranslationListItem } from '../models/translation-list-item.model'

@ObjectType('AuthAdminTranslationsPayload')
export class TranslationsPayload {
  @Field(() => [TranslationListItem])
  rows!: TranslationListItem[]

  @Field(() => Int)
  totalCount!: number
}
