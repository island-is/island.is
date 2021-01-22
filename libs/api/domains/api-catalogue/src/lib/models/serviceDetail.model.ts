import { ServiceDetail as IServiceDetail } from '@island.is/api-catalogue/types'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
  Environment,
} from '@island.is/api-catalogue/consts'
import { Field, ObjectType } from '@nestjs/graphql'
import { IsEnum, IsObject, IsString } from 'class-validator'
import { ExternalLinks } from './externalLinks.model'
import { XroadIdentifier } from './xroadIdentifier.model'

@ObjectType()
export class ServiceDetail implements IServiceDetail {
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

  @Field((type) => ExternalLinks)
  @IsObject()
  links!: ExternalLinks

  @Field((type) => XroadIdentifier)
  @IsObject()
  xroadIdentifier!: XroadIdentifier
}
