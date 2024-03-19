import { Field, ObjectType } from '@nestjs/graphql'
import { Advert, AdvertEntity, AdvertType } from './advert.model'
import { AdvertPaging } from './advert-paging.model'

@ObjectType('MinistryOfJusticeAdvertsTypeResponse')
export class AdvertTypeResponse {
  @Field(() => [AdvertType])
  types!: AdvertType[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('MinistryOfJusticeAdvertsCategoryResponse')
export class AdvertCategoryResponse {
  @Field(() => [AdvertEntity])
  categories!: AdvertEntity[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('MinistryOfJusticeAdvertsDepartmentResponse')
export class AdvertDepartmentResponse {
  @Field(() => [AdvertEntity])
  departments!: AdvertEntity[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('MinistryOfJusticeAdvertsResponse')
export class AdvertsResponse {
  @Field(() => [Advert])
  adverts!: Advert[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('MinistryOfJusticeAdvertResponse')
export class AdvertResponse {
  @Field(() => Advert)
  advert?: Advert
}
