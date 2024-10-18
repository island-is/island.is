import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementCemeteryConfig')
export class Config {
  @Field()
  key!: string

  @Field()
  value!: string
}
