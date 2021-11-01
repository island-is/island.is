import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { PageInfoResponse } from './pageInfo.response'
import { EndorsementList } from '../models/endorsementList.model'

@ObjectType()
export class PaginatedEndorsementListResponse {
  @Field()
  totalCount!: number
  @Field(() => [EndorsementList])
  data!: EndorsementList[]
  @Field(() => PageInfoResponse)
  pageInfo!: PageInfoResponse
}
