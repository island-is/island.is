import { InputType } from '@nestjs/graphql'

import { Field } from '@nestjs/graphql'

@InputType()
export class UpdateActorProfileEmailInput {
  @Field(() => String)
  fromNationalId!: string

  @Field(() => String)
  emailsId!: string
}
