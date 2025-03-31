import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { DocumentContent } from './documentContent.model'
import { Sender } from './sender.model'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Category } from './category.model'
import { Type } from './type.model'
import { Action } from './actions'

@ObjectType('DocumentV2')
export class Document {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  categoryId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  publicationDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  documentDate?: Date

  @Field()
  subject!: string

  @Field(() => Sender)
  sender!: Sender

  @Field({ nullable: true })
  opened?: boolean

  @Field({ nullable: true })
  bookmarked?: boolean

  @Field({ nullable: true })
  archived?: boolean

  @Field(() => DocumentContent, { nullable: true })
  content?: DocumentContent

  @Field({
    nullable: true,
    description: 'URL in download service. For downloading PDFs',
  })
  downloadUrl?: string

  @Field(() => Action, { nullable: true })
  alert?: Action

  @Field(() => Action, { nullable: true })
  confirmation?: Action

  @Field(() => [Action], { nullable: true })
  actions?: Array<Action>

  @Field(() => Boolean, { nullable: true })
  isUrgent?: boolean
}

@ObjectType('DocumentsV2')
export class PaginatedDocuments extends PaginatedResponse(Document) {
  @Field({ nullable: true })
  unreadCount?: number

  @Field(() => [Category], { nullable: true })
  categories?: Array<Category>

  @Field(() => [Type], { nullable: true })
  types?: Array<Type>

  @Field(() => [Sender], { nullable: true })
  senders?: Array<Sender>
}

@ObjectType()
export class DocumentPageNumber {
  @Field(() => Int)
  pageNumber!: number
}
