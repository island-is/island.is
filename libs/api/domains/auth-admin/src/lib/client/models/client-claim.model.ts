import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminClientClaim')
export class ClientClaim {
  @Field(() => String)
  type!: string

  @Field(() => String)
  value!: string
}
