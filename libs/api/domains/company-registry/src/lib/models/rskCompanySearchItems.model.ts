import { Field, Int, ObjectType } from '@nestjs/graphql'

import { PageInfoDto } from '@island.is/nest/pagination'

import { RskCompany } from './rskCompany.model'

@ObjectType()
export class RskCompanySearchItems {
  @Field(() => [RskCompany])
  data!: RskCompany[]

  @Field(() => PageInfoDto)
  pageInfo!: PageInfoDto

  @Field(() => Int)
  totalCount!: number
}
