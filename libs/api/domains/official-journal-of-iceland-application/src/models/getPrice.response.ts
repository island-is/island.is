import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetPriceResponse')
export class CaseGetPriceResponse {
  @Field(() => Number)
  price!: number
}
