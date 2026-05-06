import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('DeleteAuthAdminTranslationInput')
export class DeleteTranslationInput {
  @Field(() => String)
  language!: string

  @Field(() => String)
  className!: string

  @Field(() => String)
  property!: string

  @Field(() => String)
  key!: string

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
