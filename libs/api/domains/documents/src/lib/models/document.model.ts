import { DocumentInfoDTO } from '@island.is/clients/documents'
import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class DocumentListResponse {
  @Field(() => Number, { nullable: true })
  totalCount?: number

  @Field(() => [Document])
  data!: Document[]
}
@ObjectType()
export class Document {
  @Field(() => ID)
  id!: string

  @Field(() => Date)
  date!: Date

  @Field(() => String)
  subject!: string

  @Field(() => String)
  senderName?: string

  @Field(() => String)
  senderNatReg!: string

  @Field(() => Boolean)
  opened!: boolean

  @Field(() => String)
  fileType!: string

  @Field(() => String)
  url!: string

  @Field(() => Boolean, { nullable: true })
  bookmarked?: boolean

  @Field(() => String, { nullable: true })
  categoryId?: string

  static fromDocumentInfo(docInfo: DocumentInfoDTO): Document {
    const doc = new Document()
    doc.date = new Date(docInfo.publicationDate || docInfo.documentDate)
    doc.id = docInfo.id
    doc.opened = docInfo.opened
    doc.senderName = docInfo.senderName
    doc.subject = docInfo.subject
    doc.senderNatReg = docInfo.senderKennitala
    doc.categoryId = docInfo.categoryId
    doc.bookmarked = docInfo.bookmarked

    return doc
  }
}
