import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementsInaoConfig')
export class Config {
  @Field()
  key!: string

  @Field()
  value!: string
}
