import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationSubmitApplicationInput', {
  description: 'Submit application input',
})
export class SubmitApplicationInput {
  @Field(() => String)
  applicationId!: string
}
