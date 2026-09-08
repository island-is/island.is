import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('DeactivateAuthAdminUserIdentityInput')
export class DeactivateUserIdentityInput {
  @Field(() => String)
  subjectId!: string

  @Field(() => [Environment])
  environments!: Environment[]
}
