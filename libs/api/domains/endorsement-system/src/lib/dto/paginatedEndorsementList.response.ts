import { Field, ObjectType } from '@nestjs/graphql'
import { PageInfoResponse } from './pageInfo.response'
import { EndorsementList } from '../models/endorsementList.model'
import { CacheField } from '@island.is/nest/graphql' // Importing CacheField

@ObjectType()
export class PaginatedEndorsementListResponse {
  @Field()
  totalCount!: number

  @CacheField(() => [EndorsementList]) // Using CacheField for non-scalar field (array of objects)
  data!: EndorsementList[]

  @CacheField(() => PageInfoResponse) // Using CacheField for non-scalar field (object)
  pageInfo!: PageInfoResponse
}
