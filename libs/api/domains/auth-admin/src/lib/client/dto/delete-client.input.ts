import { Field, InputType } from '@nestjs/graphql'
import { Environment } from '@island.is/shared/types'

@InputType('AuthAdminDeleteClientInput')
export class DeleteClientInput {
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => String, { nullable: false })
  clientId!: string

  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]
}
