import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('UpdateAuthAdminLanguageInput')
export class UpdateLanguageInput {
  @Field(() => String)
  isoKey!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  englishDescription!: string

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
