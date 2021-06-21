import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DocumentsListModel {
  @Field(() => [DocumentsListItem])
  documentsList!: DocumentsListItem[]
}

@ObjectType()
export class DocumentsListItem {
  @Field()
  id!: string

  @Field()
  date!: string

  @Field()
  type!: string

  @Field(() => String, { nullable: true })
  note?: string | null

  @Field()
  sender!: string

  @Field()
  dateOpen!: string

  @Field()
  amount!: number
}
