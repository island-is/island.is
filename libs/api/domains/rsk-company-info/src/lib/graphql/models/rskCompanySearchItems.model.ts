import { Field, Int, ObjectType } from '@nestjs/graphql'
import { RskCompany } from './rskCompany.model'

@ObjectType()
export class RskCompanyPageInfo {
  @Field(() => String, { nullable: true })
  endCursor?: string

  @Field(() => Boolean, { nullable: true })
  hasNextPage?: boolean
}

@ObjectType()
export class RskCompanySearchItems {
  @Field(() => [RskCompany], { nullable: true })
  items?: RskCompany[]

  @Field(() => RskCompanyPageInfo, { nullable: true })
  pageInfo?: RskCompanyPageInfo

  @Field(() => Int, { nullable: true })
  count?: number
}
