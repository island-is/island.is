import { InputType } from '@nestjs/graphql'

import { Field } from '@nestjs/graphql'

@InputType()
export class SetPrimaryEmailInput {
  @Field(() => String)
  emailId!: string
}
