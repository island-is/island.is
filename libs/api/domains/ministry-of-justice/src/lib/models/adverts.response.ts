import { Field, ObjectType } from '@nestjs/graphql'
import { AdvertType } from './advert.model'
import { AdvertPaging } from './paging.model'

@ObjectType('MinistryOfJusticeAdvertsTypeResponse')
export class AdvertsTypeResponse {
  @Field(() => [AdvertType])
  types!: AdvertType[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}
