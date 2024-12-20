import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('OJOIAGetCommentsInput')
export class GetCommentsInput {
  @Field(() => ID)
  id!: string
}
