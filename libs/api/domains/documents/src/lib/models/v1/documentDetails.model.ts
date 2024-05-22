import { DocumentDTO } from '@island.is/clients/documents'
import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType()
export class DocumentDetails {
  @Field(() => String)
  fileType!: string

  @Field(() => String)
  content?: string

  @Field(() => String)
  html!: string

  @Field(() => String)
  url!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  publicationDate?: Date

  @Field(() => Boolean, { nullable: true })
  bookmarked?: boolean

  @Field(() => Boolean, { nullable: true })
  archived?: boolean

  @Field(() => String, { nullable: true })
  senderName?: string

  @Field(() => String, { nullable: true })
  senderKennitala?: string

  @Field(() => String, { nullable: true })
  subject?: string

  @Field(() => String, { nullable: true })
  categoryId?: string

  static fromDocumentDTO(dto: DocumentDTO) {
    const doc = new DocumentDetails()
    doc.content = dto.content || ''
    doc.fileType = dto.fileType || ''
    doc.html = dto.htmlContent || ''
    doc.url = dto.url || ''
    doc.publicationDate = dto.publicationDate
      ? new Date(dto.publicationDate)
      : undefined
    doc.bookmarked = dto.bookmarked
    doc.archived = dto.archived
    doc.senderName = dto.senderName
    doc.senderKennitala = dto.senderKennitala
    doc.subject = dto.subject
    doc.categoryId = dto.categoryId
    return doc
  }
}
