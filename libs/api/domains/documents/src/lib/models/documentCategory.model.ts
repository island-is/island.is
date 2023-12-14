import { CategoryDTO } from '@island.is/clients/documents-v2'
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class DocumentCategory {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name?: string

  static fromCategoryDTO(dto: CategoryDTO): DocumentCategory | null {
    if (!dto.id) {
      return null
    }
    const category = new DocumentCategory()
    category.id = dto.id
    category.name = dto.name

    return category
  }
}
