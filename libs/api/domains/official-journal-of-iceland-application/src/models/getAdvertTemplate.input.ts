import { Field, InputType } from '@nestjs/graphql'
import { TemplateType } from './applicationAdvertTemplate.response'

@InputType('OfficialJournalOfIcelandAdvertTemplateInput')
export class GetAdvertTemplateInput {
  @Field(() => TemplateType)
  type!: TemplateType
}
