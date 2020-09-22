import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { Service } from '@island.is/api-catalogue/types'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'

registerEnumType(AccessCategory, {
  name: 'accessCategoryEnum',
})

registerEnumType(PricingCategory, {
  name: 'PricingCategoryEnum',
})

registerEnumType(DataCategory, {
  name: 'DataCategoryEnum',
})

registerEnumType(TypeCategory, {
  name: 'TypeCategoryEnum',
})

@ObjectType()
export class PageInfo {
  @Field()
  nextCursor: string
}

@ObjectType()
export class ApiService implements Service {
  @Field((type) => ID)
  id: string

  @Field()
  @IsString()
  owner: string

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  description: string

  @Field()
  @IsString()
  url: string

  @Field((type) => PricingCategory)
  @IsEnum(PricingCategory)
  pricing: PricingCategory

  @Field((type) => [DataCategory])
  @IsEnum(DataCategory)
  data: Array<DataCategory>

  @Field((type) => TypeCategory)
  @IsEnum(TypeCategory)
  type: TypeCategory

  @Field((type) => [AccessCategory])
  @IsEnum(AccessCategory)
  access: Array<AccessCategory>

  @Field((type) => Date)
  @IsDate()
  created: Date

  @Field((type) => Date, { nullable: true })
  @IsDate()
  updated?: Date
}

@ObjectType()
export class ApiCatalogue {
  @Field((type) => [ApiService])
  services: ApiService[]

  @Field((type) => PageInfo, { nullable: true })
  @IsOptional()
  pageInfo?: PageInfo
}
