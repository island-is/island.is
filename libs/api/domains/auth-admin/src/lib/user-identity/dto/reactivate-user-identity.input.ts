import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('ReactivateAuthAdminUserIdentityInput')
export class ReactivateUserIdentityInput {
  @Field(() => String)
  subjectId!: string

  @Field(() => [Environment])
  environments!: Environment[]
}
