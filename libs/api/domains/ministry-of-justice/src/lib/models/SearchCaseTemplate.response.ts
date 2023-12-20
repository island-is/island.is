import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Case } from './Case.model'

@ObjectType('MinistryOfJusticeSearchCaseTemplateResponse')
export class SearchCaseTemplateResponse {
  @Field(() => [Case])
  items!: Case[]

  @Field(() => Int)
  count!: number
}
