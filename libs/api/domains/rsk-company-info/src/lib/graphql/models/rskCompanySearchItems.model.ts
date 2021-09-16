import { Field, ObjectType, ID } from '@nestjs/graphql'
import { RskCompanyLink } from './rskCompanyLink.model'
import { RskCompanySearchItem } from './rskCompanySearchItem.model'

@ObjectType()
export class RskCompanySearchItems {
  @Field(() => [RskCompanySearchItem])
  items?: RskCompanySearchItem[]

  @Field(() => Boolean)
  hasMore?: boolean

  @Field(() => Number)
  limit?: number

  @Field(() => Number)
  offset?: number

  @Field(() => Number)
  count?: number

  @Field(() => [RskCompanyLink])
  links?: RskCompanyLink[]
}
