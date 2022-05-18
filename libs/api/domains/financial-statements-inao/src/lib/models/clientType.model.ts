import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementsInaoClientType')
export class ClientType {
  @Field()
  name!: string

  @Field()
  code!: string
}
