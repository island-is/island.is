import { Field, ObjectType, ID } from '@nestjs/graphql'
@ObjectType()
export class UserSpouse {
  @Field(() => ID, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  maritalStatus?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
