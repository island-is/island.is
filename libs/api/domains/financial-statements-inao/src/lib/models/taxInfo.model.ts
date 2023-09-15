import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementsInaoTaxInfo')
export class TaxInfo {
  @Field()
  key!: number

  @Field()
  value!: number
}
