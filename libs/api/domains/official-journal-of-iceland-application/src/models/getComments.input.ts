import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationGetCommentsInput')
export class GetCommentsInput {
  @Field(() => String)
  id!: string
}
