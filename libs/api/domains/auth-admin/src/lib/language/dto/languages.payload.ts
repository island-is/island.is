import { Field, Int, ObjectType } from '@nestjs/graphql'

import { LanguageListItem } from '../models/language-list-item.model'

@ObjectType('AuthAdminLanguagesPayload')
export class LanguagesPayload {
  @Field(() => [LanguageListItem])
  rows!: LanguageListItem[]

  @Field(() => Int)
  totalCount!: number
}
