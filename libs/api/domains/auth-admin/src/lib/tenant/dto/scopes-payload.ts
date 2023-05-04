import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminScopesPayload')
export class ScopesPayload {
  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => String, { nullable: false })
  displayName!: string

  @Field(() => String, { nullable: true })
  description?: string
}
