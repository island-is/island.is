import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementsInaoClientType')
export class ClientType {
  // @Field()
  // clientTypeId!: string

  // @Field()
  // name!: string

  // @Field()
  // code!: string

  @Field()
  value!: string

  @Field()
  label!: string
}
