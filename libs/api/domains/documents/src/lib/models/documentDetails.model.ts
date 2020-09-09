import { ObjectType, Field, ID } from '@nestjs/graphql'
import { DocumentDTO } from '../../../gen/fetch'

@ObjectType()
export class DocumentDetails {
  @Field((type) => String)
  fileType: string

  @Field((type) => String)
  content?: string

  @Field((type) => String)
  html: string

  @Field((type) => String)
  url: string

  static fromDocumentDTO(dto: DocumentDTO) {
    const doc = new DocumentDetails()
    doc.content = dto.content
    doc.fileType = dto.fileType
    doc.fileType = dto.fileType
    doc.url = dto.url
    return doc
  }
}
