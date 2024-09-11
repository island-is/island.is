import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationGetCommentsInput')
export class GetCommentsInput {
  @Field()
  id!: string
}
