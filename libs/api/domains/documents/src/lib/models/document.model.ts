import { DocumentInfoDTO } from '@island.is/clients/documents-v2'
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

  static fromDocumentInfo(docInfo: DocumentInfoDTO): Document | null {
    const date = docInfo.publicationDate || docInfo.documentDate

    if (
      !date ||
      !docInfo.id ||
      !docInfo.opened ||
      !docInfo.subject ||
      !docInfo.senderKennitala
    ) {
      return null
    }

    const doc = new Document()
    doc.date = date
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
