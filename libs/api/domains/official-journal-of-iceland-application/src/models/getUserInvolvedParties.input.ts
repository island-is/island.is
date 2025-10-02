import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('GetUserInvolvedPartiesInput')
export class GetUserInvolvedPartiesInput {
  @Field(() => ID)
  applicationId!: string

  @Field(() => String, { nullable: true })
  partyName?: string
}
