import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceDocumentData')
export class FinanceDocumentData {
  @Field()
  type!: string

  @Field()
  document!: string
}

@ObjectType('FinanceDocumentModel')
export class FinanceDocumentModel {
  @Field(() => FinanceDocumentData)
  docment!: FinanceDocumentData
}
