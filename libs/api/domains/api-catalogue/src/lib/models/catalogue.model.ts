import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { Service } from '@island.is/api-catalogue/types'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PageInfo } from './pageInfo.model'
import { XroadInfo } from './xroadIdentifier.model'

registerEnumType(AccessCategory, {
  name: 'AccessCategoryEnum',
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
export class ApiService implements Service {
  @Field((type) => ID)
  @IsString()
  id: string

  @Field((type) => String)
  @IsString()
  owner: string

  @Field((type) => String)
  @IsString()
  name: string

  @Field((type) => String)
  @IsString()
  description: string

  @Field((type) => [PricingCategory])
  @IsEnum(PricingCategory)
  pricing: Array<PricingCategory>

  @Field((type) => [DataCategory])
  @IsEnum(DataCategory)
  data: Array<DataCategory>

  @Field((type) => [TypeCategory])
  @IsEnum(TypeCategory)
  type: Array<TypeCategory>

  @Field((type) => [AccessCategory])
  @IsEnum(AccessCategory)
  access: Array<AccessCategory>

  @Field((type) => [XroadInfo], { nullable: true })
  @IsOptional()
  xroadIdentifier?: Array<XroadInfo>
}

@ObjectType()
export class ApiCatalogue {
  @Field((type) => [ApiService])
  services: ApiService[]

  @Field((type) => PageInfo, { nullable: true })
  @IsOptional()
  pageInfo?: PageInfo
}
