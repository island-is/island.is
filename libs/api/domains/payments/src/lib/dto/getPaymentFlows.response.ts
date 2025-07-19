import { Field, ObjectType } from '@nestjs/graphql'
import { GetPaymentFlowResponse } from './getPaymentFlow.response'

@ObjectType('PaymentsPageInfo')
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage!: boolean

  @Field(() => Boolean)
  hasPreviousPage!: boolean

  @Field(() => String, { nullable: true })
  startCursor?: string

  @Field(() => String, { nullable: true })
  endCursor?: string
}

@ObjectType('PaymentsGetPaymentFlowsResponse')
export class GetPaymentFlowsResponse {
  @Field(() => [GetPaymentFlowResponse])
  data!: GetPaymentFlowResponse[]

  @Field(() => Number)
  totalCount!: number

  @Field(() => PageInfo)
  pageInfo!: PageInfo
}
