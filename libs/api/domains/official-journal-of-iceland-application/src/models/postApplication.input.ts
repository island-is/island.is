import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationPostApplicationInput', {
  description: 'Submit application input',
})
export class PostApplicationInput {
  @Field()
  id!: string
}
