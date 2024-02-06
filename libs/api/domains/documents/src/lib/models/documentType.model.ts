import { MessageTypeDTO } from '@island.is/clients/documents'
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class DocumentType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name?: string

  static fromTypeDTO(dto: MessageTypeDTO) {
    if (!dto.id) {
      return null
    }

    const type = new DocumentType()
    type.id = dto.id
    type.name = dto.name

    return type
  }
}
