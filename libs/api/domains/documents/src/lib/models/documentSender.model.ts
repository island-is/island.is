import { ObjectType, Field, ID } from '@nestjs/graphql'
import { SenderDTO } from '@island.is/clients/documents'

@ObjectType()
export class DocumentSender {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name?: string

  static fromSenderDTO(dto: SenderDTO) {
    const type = new DocumentSender()
    type.id = dto.kennitala
    type.name = dto.name

    return type
  }
}
