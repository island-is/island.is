import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('DeleteAuthAdminLanguageInput')
export class DeleteLanguageInput {
  @Field(() => String)
  isoKey!: string

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
