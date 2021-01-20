import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
  Environment,
} from '@island.is/api-catalogue/consts'
import {
  Service,
  ServiceVersion,
  XroadIdentifier,
} from '@island.is/api-catalogue/types'
import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator'
import { PageInfo } from './pageInfo.model'
import { XroadInfo } from './xroadIdentifier.model'

registerEnumType(AccessCategory, {
  name: 'AccessCategory',
})

registerEnumType(DataCategory, {
  name: 'DataCategory',
})

registerEnumType(PricingCategory, {
  name: 'PricingCategory',
})

registerEnumType(TypeCategory, {
  name: 'TypeCategory',
})

registerEnumType(Environment, {
  name: 'Environment',
})

@ObjectType()
export class ApiServiceVersion implements ServiceVersion {
  @Field((type) => ID)
  @IsString()
  versionId!: string

  @Field((type) => String)
  @IsString()
  title!: string

  @Field((type) => String)
  @IsString()
  summary!: string

  @Field((type) => String)
  @IsString()
  description!: string

  @Field((type) => TypeCategory)
  @IsEnum(TypeCategory)
  type!: TypeCategory

  @Field((type) => [PricingCategory])
  @IsEnum(PricingCategory)
  pricing!: PricingCategory[]

  @Field((type) => [DataCategory])
  @IsEnum(DataCategory)
  data!: DataCategory[]

  @Field((type) => [XroadInfo])
  @IsArray()
  xroadIdentifier!: XroadIdentifier[]
}

@ObjectType()
export class ApiService implements Service {
  @Field((type) => ID)
  @IsString()
  id!: string

  @Field((type) => String)
  @IsString()
  owner!: string

  @Field((type) => String)
  @IsString()
  title!: string

  @Field((type) => String)
  @IsString()
  summary!: string

  @Field((type) => String)
  @IsString()
  description!: string

  @Field((type) => [PricingCategory])
  @IsEnum(PricingCategory)
  pricing!: Array<PricingCategory>

  @Field((type) => [DataCategory])
  @IsEnum(DataCategory)
  data!: Array<DataCategory>

  @Field((type) => [TypeCategory])
  @IsEnum(TypeCategory)
  type!: Array<TypeCategory>

  @Field((type) => [AccessCategory])
  @IsEnum(AccessCategory)
  access!: Array<AccessCategory>

  @Field((type) => [Environment])
  @IsEnum(Environment)
  instances!: Array<Environment>

  @Field((type) => [ApiServiceVersion])
  @IsArray()
  versions!: Array<ServiceVersion>
}

@ObjectType()
export class ApiCatalogue {
  @Field((type) => [ApiService])
  services!: ApiService[]

  @Field((type) => PageInfo, { nullable: true })
  @IsOptional()
  pageInfo?: PageInfo
}
