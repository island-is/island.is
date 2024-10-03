import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementCemeteryClientType')
export class ClientType {
  @Field()
  value!: string

  @Field()
  label!: string
}
