import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementCemeteryTaxInfo')
export class TaxInfo {
  @Field()
  key!: number

  @Field()
  value!: number
}
