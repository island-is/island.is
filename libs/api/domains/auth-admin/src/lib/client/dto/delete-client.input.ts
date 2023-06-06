import { Field, InputType } from '@nestjs/graphql'
import { Environment } from '@island.is/shared/types'

@InputType('AuthAdminDeleteClientInput')
export class DeleteClientInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => String)
  clientId!: string

  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]
}
