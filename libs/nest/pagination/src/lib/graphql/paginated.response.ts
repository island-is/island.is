import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { PageInfoDto } from '../dto/pageinfo.dto'

/**
 * This generic implementation for paginated response is based on TypeGraphQL's implementation
 * https://typegraphql.com/docs/generic-types.html
 */

interface ClassType<T = any> {
  new (...args: any[]): T
}

export function PaginatedResponse<TItemsFieldValue>(
  itemsFieldValue: ClassType<TItemsFieldValue>,
) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @CacheField(() => [itemsFieldValue])
    data!: TItemsFieldValue[]

    @Field()
    totalCount!: number

    @CacheField(() => PageInfoDto)
    pageInfo!: PageInfoDto
  }

  return PaginatedResponseClass
}
