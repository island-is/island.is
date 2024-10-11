import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetPriceResponse')
export class CaseGetPriceResponse {
  @Field(() => Int)
  price!: number
}
