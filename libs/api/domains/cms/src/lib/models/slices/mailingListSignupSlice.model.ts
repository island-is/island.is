import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class MailingListSignupSlice {
  constructor(initializer: MailingListSignupSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field()
  inputLabel: string

  @Field()
  buttonText: string
}
