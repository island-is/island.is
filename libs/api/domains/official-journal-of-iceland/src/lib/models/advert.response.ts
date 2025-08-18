import { Field, ObjectType } from '@nestjs/graphql'
import {
  Advert,
  AdvertCategory,
  AdvertEntity,
  AdvertMainCategory,
  AdvertType,
  AdvertMainType,
  AdvertSimilar,
  AdvertLean,
} from './advert.model'
import { AdvertPaging } from './advert-paging.model'

@ObjectType('OfficialJournalOfIcelandAdvertsTypeResponse')
export class AdvertTypeResponse {
  @Field(() => AdvertType)
  type!: AdvertType
}

@ObjectType('OfficialJournalOfIcelandAdvertsTypesResponse')
export class AdvertTypesResponse {
  @Field(() => [AdvertType])
  types!: AdvertType[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalOfIcelandAdvertsMainCategoriesResponse')
export class AdvertMainCategoriesResponse {
  @Field(() => [AdvertMainCategory])
  mainCategories!: AdvertMainCategory[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalOfIcelandAdvertsCategoryResponse')
export class AdvertCategoryResponse {
  @Field(() => [AdvertCategory])
  categories!: AdvertCategory[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalOfIcelandAdvertsDepartmentResponse')
export class AdvertDepartmentResponse {
  @Field(() => AdvertEntity)
  department!: AdvertEntity
}

@ObjectType('OfficialJournalOfIcelandAdvertsDepartmentsResponse')
export class AdvertDepartmentsResponse {
  @Field(() => [AdvertEntity])
  departments!: AdvertEntity[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalOfIcelandAdvertsInstitutionsResponse')
export class AdvertInstitutionsResponse {
  @Field(() => [AdvertEntity])
  institutions!: AdvertEntity[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalOfIcelandAdvertsFullResponse')
export class AdvertsFullResponse {
  @Field(() => [Advert])
  adverts!: Advert[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}
@ObjectType('OfficialJournalOfIcelandAdvertsResponse')
export class AdvertsResponse {
  @Field(() => [AdvertLean])
  adverts!: AdvertLean[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}

@ObjectType('OfficialJournalOfIcelandAdvertResponse')
export class AdvertResponse {
  @Field(() => Advert)
  advert?: Advert
}

@ObjectType('OfficialJournalOfIcelandAdvertSimilarResponse')
export class AdvertSimilarResponse {
  @Field(() => [AdvertSimilar])
  adverts!: AdvertSimilar[]
}

@ObjectType('OfficialJournalOfIcelandMainTypesResponse')
export class MainTypesResponse {
  @Field(() => [AdvertMainType])
  mainTypes!: AdvertMainType[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}
