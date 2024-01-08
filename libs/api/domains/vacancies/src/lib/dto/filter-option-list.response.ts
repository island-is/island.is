import { ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { FilterOption } from '../models/filter-option.model'

@ObjectType()
export class FilterOptionListResponse {
  @CacheField(() => [FilterOption])
  options!: FilterOption[]
}
