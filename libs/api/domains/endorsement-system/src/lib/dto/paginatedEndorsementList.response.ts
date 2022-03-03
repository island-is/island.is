import { Field, InputType, ObjectType } from '@nestjs/graphql'

import { EndorsementList } from '../models/endorsementList.model'

import { PageInfoResponse } from './pageInfo.response'

@ObjectType()
export class PaginatedEndorsementListResponse {
  @Field()
  totalCount!: number
  @Field(() => [EndorsementList])
  data!: EndorsementList[]
  @Field(() => PageInfoResponse)
  pageInfo!: PageInfoResponse
}
