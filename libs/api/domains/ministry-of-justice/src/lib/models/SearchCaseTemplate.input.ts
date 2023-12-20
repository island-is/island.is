import { Field, InputType } from '@nestjs/graphql'

@InputType('MinistryOfJusticeSearchCaseTemplateInput')
export class SearchCaseTemplateInput {
  @Field(() => String)
  q!: string
}
