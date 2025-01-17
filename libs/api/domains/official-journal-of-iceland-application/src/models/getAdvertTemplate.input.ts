import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandAdvertTemplateInput')
export class GetAdvertTemplateInput {
  @Field()
  type!: string
}
