import { SenderDTO } from '@island.is/clients/documents-v2'
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class DocumentSender {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name?: string

  static fromSenderDTO(dto: SenderDTO): DocumentSender | null {
    if (!dto.kennitala) {
      return null
    }
    const type = new DocumentSender()
    type.id = dto.kennitala
    type.name = dto.name

    return type
  }
}
