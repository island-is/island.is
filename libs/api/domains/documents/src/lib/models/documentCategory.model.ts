import { ObjectType, Field, ID } from '@nestjs/graphql'
import { CategoryDTO } from '../client/models'

@ObjectType()
export class DocumentCategory {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name?: string

  static fromCategoryDTO(dto: CategoryDTO) {
    const category = new DocumentCategory()
    category.id = dto.id
    category.name = dto.name

    return category
  }
}
