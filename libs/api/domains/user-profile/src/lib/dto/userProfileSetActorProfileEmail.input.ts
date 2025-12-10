import { Field, InputType } from '@nestjs/graphql'

@InputType('UserProfileSetActorProfileEmailInput')
export class UserProfileSetActorProfileEmailInput {
  @Field(() => String)
  emailId!: string

  @Field(() => String)
  fromNationalId!: string
}
