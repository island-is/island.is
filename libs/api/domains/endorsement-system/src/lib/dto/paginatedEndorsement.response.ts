import { Field, ObjectType } from '@nestjs/graphql'
import { PageInfoResponse } from './pageInfo.response'
import { Endorsement } from '../models/endorsement.model'
import { CacheField } from '@island.is/nest/graphql' // Importing CacheField

@ObjectType()
export class PaginatedEndorsementResponse {
  @Field()
  totalCount!: number

  @CacheField(() => [Endorsement])
  data!: Endorsement[]

  @CacheField(() => PageInfoResponse)
  pageInfo!: PageInfoResponse
}
