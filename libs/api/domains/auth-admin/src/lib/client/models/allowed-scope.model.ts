import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminClientAllowedScope')
export class AllowedScope {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String, { nullable: true })
  description?: string
}
