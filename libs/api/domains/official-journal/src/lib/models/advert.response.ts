import { Field, ObjectType } from '@nestjs/graphql'
import {
  Advert,
  AdvertCategory,
  AdvertEntity,
  AdvertMainCategory,
  AdvertType,
} from './advert.model'
import { AdvertPaging } from './advert-paging.model'

@ObjectType('OfficialJournalAdvertsTypeResponse')
export class AdvertTypeResponse {
  @Field(() => [AdvertType])
  types!: AdvertType[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalAdvertsMainCategoriesResponse')
export class AdvertMainCategoriesResponse {
  @Field(() => [AdvertMainCategory])
  mainCategories!: AdvertMainCategory[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalAdvertsCategoryResponse')
export class AdvertCategoryResponse {
  @Field(() => [AdvertCategory])
  categories!: AdvertCategory[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalAdvertsDepartmentResponse')
export class AdvertDepartmentResponse {
  @Field(() => [AdvertEntity])
  departments!: AdvertEntity[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalAdvertsInstitutionsResponse')
export class AdvertInstitutionsResponse {
  @Field(() => [AdvertEntity])
  institutions!: AdvertEntity[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalAdvertsResponse')
export class AdvertsResponse {
  @Field(() => [Advert])
  adverts!: Advert[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalAdvertResponse')
export class AdvertResponse {
  @Field(() => Advert)
  advert?: Advert
}
