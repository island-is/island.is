import { Field, ObjectType } from '@nestjs/graphql'
import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminCreateClientResponse')
export class CreateClientResponse {
  @Field(() => String, { nullable: false })
  clientId!: string

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
