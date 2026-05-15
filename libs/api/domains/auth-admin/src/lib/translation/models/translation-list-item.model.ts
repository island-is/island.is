import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminTranslationListItem')
export class TranslationListItem {
  @Field(() => String)
  language!: string

  @Field(() => String)
  className!: string

  @Field(() => String)
  property!: string

  @Field(() => String)
  key!: string

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]
}
