import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('UpdateAuthAdminTranslationInput')
export class UpdateTranslationInput {
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
  environments?: Environment[]
}
