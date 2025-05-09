import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SetActorProfileEmailInput {
  @Field(() => String)
  emailId!: string
}
