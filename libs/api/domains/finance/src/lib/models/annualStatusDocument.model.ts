import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FinanceDocumentData {
  @Field()
  type!: string

  @Field()
  document!: string
}

@ObjectType()
export class FinanceDocumentModel {
  @Field(() => FinanceDocumentData)
  docment!: FinanceDocumentData
}
