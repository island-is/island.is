import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceDocumentsListModel')
export class DocumentsListModel {
  @Field(() => [DocumentsListItem])
  documentsList!: DocumentsListItem[]

  @Field(() => String, { nullable: true })
  downloadServiceURL?: string
}

@ObjectType('FinanceDocumentsListItem')
export class DocumentsListItem {
  @Field()
  id!: string

  @Field()
  date!: string

  @Field()
  type!: string

  @Field(() => String, { nullable: true })
  note?: string

  @Field()
  sender!: string

  @Field()
  dateOpen!: string

  @Field()
  amount!: number
}
