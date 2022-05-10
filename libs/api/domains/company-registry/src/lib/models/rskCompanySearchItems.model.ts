import { Field, Int, ObjectType } from '@nestjs/graphql'
import { RskCompany } from './rskCompany.model'
import { PageInfoDto } from '@island.is/nest/pagination'

@ObjectType()
export class RskCompanySearchItems {
  @Field(() => [RskCompany])
  data!: RskCompany[]

  @Field(() => PageInfoDto)
  pageInfo!: PageInfoDto
}
