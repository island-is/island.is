import { Field, ObjectType } from '@nestjs/graphql'

import { Endorsement } from '../models/endorsement.model'

import { PageInfoResponse } from './pageInfo.response'

@ObjectType()
export class PaginatedEndorsementResponse {
  @Field()
  totalCount!: number
  @Field(() => [Endorsement])
  data!: Endorsement[]
  @Field(() => PageInfoResponse)
  pageInfo!: PageInfoResponse
}
