import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminClientClaim')
@InputType('AuthAdminClientClaimInput')
export class ClientClaim {
  @Field(() => String)
  type!: string

  @Field(() => String)
  value!: string
}
