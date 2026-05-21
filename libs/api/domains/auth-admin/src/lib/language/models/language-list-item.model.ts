import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminLanguageListItem')
export class LanguageListItem {
  @Field(() => String)
  isoKey!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  englishDescription!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]
}
