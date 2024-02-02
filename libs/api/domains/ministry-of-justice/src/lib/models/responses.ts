import { Field, ObjectType } from '@nestjs/graphql'
import { Advert } from './advert.model'
import { AdvertPaging } from './paging.model'

@ObjectType('MinistryOfJusticeAdvertsResponse')
export class AdvertsResponse {
  @Field(() => [Advert])
  adverts!: Advert[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}
