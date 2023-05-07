import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminScope')
export class ScopeDTO {
  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => String, { nullable: false })
  displayName!: string

  @Field(() => String, { nullable: false })
  description!: string
}
