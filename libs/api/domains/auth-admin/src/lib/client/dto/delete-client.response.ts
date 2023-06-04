import { ObjectType, Field } from '@nestjs/graphql'
import { Environment } from 'environment'

@ObjectType('AuthAdminDeleteClientResponse')
export class DeleteClientResponse {
  @Field(() => Environment, { nullable: false })
  environment!: Environment

  @Field(() => Boolean, { nullable: false })
  success!: boolean
}
