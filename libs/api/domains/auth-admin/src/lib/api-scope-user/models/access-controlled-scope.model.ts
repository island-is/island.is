import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminAccessControlledScope')
export class AccessControlledScope {
  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  displayName?: string

  @Field(() => String, { nullable: true })
  description?: string
}
