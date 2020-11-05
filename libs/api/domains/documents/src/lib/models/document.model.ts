import { Field, ObjectType, ID } from '@nestjs/graphql'
import { DocumentInfoDTO } from '../client/models'

@ObjectType()
export class Document {
  @Field(() => ID)
  id: string

  @Field(() => Date)
  date: Date

  @Field(() => String)
  subject: string

  @Field(() => String)
  senderName?: string

  @Field(() => String)
  senderNatReg: string

  @Field(() => Boolean)
  opened: boolean

  static fromDocumentInfo(docInfo: DocumentInfoDTO): Document {
    const doc = new Document()
    doc.date = new Date(docInfo.documentDate)
    doc.id = docInfo.id
    doc.opened = docInfo.opened
    doc.senderName = docInfo.senderName
    doc.subject = docInfo.subject
    doc.senderNatReg = docInfo.senderKennitala

    return doc
  }
}
