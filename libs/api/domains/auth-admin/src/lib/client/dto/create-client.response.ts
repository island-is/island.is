import { Field, ObjectType } from '@nestjs/graphql'
import { Environment } from 'environment'

@ObjectType('AuthAdminCreateClientResponse')
export class CreateClientResponse {
  @Field(() => String, { nullable: false })
  clientId!: string

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
