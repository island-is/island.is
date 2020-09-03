import { ObjectType, Field, ID } from '@nestjs/graphql'
import { DocumentDTO, CategoryDTO } from '../../../gen/fetch'

@ObjectType()
export class DocumentCategory {
  @Field((type) => ID)
  id: string

  @Field((type) => String)
  name?: string

  static fromCategoryDTO(dto: CategoryDTO) {
    const category = new DocumentCategory()
    category.id = dto.id
    category.name = dto.name

    return category
  }
}
