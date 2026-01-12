import { Field, InputType } from '@nestjs/graphql'

@InputType('SetActorProfileEmailInput')
export class SetActorProfileEmailInput {
  @Field(() => String)
  emailId!: string
}
