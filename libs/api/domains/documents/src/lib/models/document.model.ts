import { Field, ObjectType, ID } from '@nestjs/graphql'
import { DocumentInfoDTO, DocumentDTO } from '../../../gen/fetch'

@ObjectType()
export class Document {
  @Field((type) => ID)
  id: string

  @Field((type) => Date)
  date: Date

  @Field((type) => String)
  subject: string

  @Field((type) => String)
  senderName?: string

  @Field((type) => String)
  senderNatReg: string

  @Field((type) => Boolean)
  opened: boolean

  static fromDocumentInfo(docInfo: DocumentInfoDTO): Document {
    const doc = new Document()
    doc.date = docInfo.documentDate
    doc.id = docInfo.id
    doc.opened = docInfo.opened
    doc.senderName = docInfo.senderName
    doc.subject = docInfo.subject
    doc.senderNatReg = docInfo.senderKennitala
    return doc
  }
}
