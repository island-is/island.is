import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminUserIdentityClaim')
export class UserIdentityClaim {
  @Field(() => String)
  type!: string

  @Field(() => String)
  value!: string

  @Field(() => String, { nullable: true })
  valueType?: string

  @Field(() => String, { nullable: true })
  issuer?: string

  @Field(() => String, { nullable: true })
  originalIssuer?: string
}
