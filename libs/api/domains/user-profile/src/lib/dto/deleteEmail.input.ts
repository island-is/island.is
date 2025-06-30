import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteEmailInput {
  @Field(() => String)
  emailId!: string
}
