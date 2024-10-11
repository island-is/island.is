import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminDelegationType')
export class DelegationType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  providerId!: string
}
