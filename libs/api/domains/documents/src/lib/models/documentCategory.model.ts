import { ObjectType, Field, ID } from '@nestjs/graphql'
import { CategoryDTO } from '@island.is/clients/documents'

@ObjectType()
export class DocumentCategory {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name?: string

  static fromCategoryDTO(dto: CategoryDTO) {
    const category = new DocumentCategory()
    category.id = dto.id
    category.name = dto.name

    return category
  }
}
