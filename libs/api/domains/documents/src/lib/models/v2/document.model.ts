import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { DocumentContent } from './documentContent.model'
import { Sender } from './sender.model'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Category } from './category.model'
import { Type } from './type.model'
import { Action } from './actions.model'
import { Ticket } from './ticket.model'

@ObjectType('DocumentV2')
export class Document {
  @Field(() => ID)
  id!: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  categoryId?: string | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  publicationDate?: Date | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  documentDate?: Date | null

  @Field()
  subject!: string

  @Field(() => Sender)
  sender!: Sender

  @Field({ nullable: true })
  opened?: boolean

  @Field(() => Boolean, { nullable: true })
  bookmarked?: boolean | null

  @Field(() => Boolean, { nullable: true })
  archived?: boolean | null

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
  actions?: Array<Action> | null

  @Field(() => Boolean, { nullable: true })
  isUrgent?: boolean | null

  @Field(() => Boolean, { nullable: true })
  replyable?: boolean | null

  @Field(() => Boolean, { nullable: true })
  closedForMoreReplies?: boolean | null

  @Field(() => Ticket, { nullable: true })
  ticket?: Ticket | null
}

@ObjectType('DocumentsV2')
export class PaginatedDocuments extends PaginatedResponse(Document) {
  @Field(() => Int, { nullable: true })
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
