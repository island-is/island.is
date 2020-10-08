import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  mobilePhoneNumber!: string

  @Field(() => String)
  locale!: string

  @Field(() => String)
  email!: string
}
