import { ObjectType, Field, ID } from '@nestjs/graphql'
import { TypeDTO } from '@island.is/clients/documents'

@ObjectType()
export class DocumentType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name?: string

  static fromTypeDTO(dto: TypeDTO) {
    const type = new DocumentType()
    type.id = dto.id
    type.name = dto.name

    return type
  }
}
