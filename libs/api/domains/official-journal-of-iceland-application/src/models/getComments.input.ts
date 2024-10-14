import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationGetCommentsInput')
export class GetCommentsInput {
  @Field(() => ID)
  id!: string
}
