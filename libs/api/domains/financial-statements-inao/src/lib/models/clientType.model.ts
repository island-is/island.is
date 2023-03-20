import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementsInaoClientType')
export class ClientType {
  @Field()
  value!: string

  @Field()
  label!: string
}
