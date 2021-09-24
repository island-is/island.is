import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { PageInfoResponse } from './pageInfo.response'
import { Endorsement } from '../models/endorsement.model'

@ObjectType()
export class PaginatedEndorsementResponse {
  @Field()
  totalCount!: number
  @Field(() => [Endorsement])
  data!: Endorsement[]
  @Field(() => PageInfoResponse)
  pageInfo!: PageInfoResponse
}
