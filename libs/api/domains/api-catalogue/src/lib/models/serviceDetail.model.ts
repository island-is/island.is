import { ServiceDetail as IServiceDetail } from '@island.is/api-catalogue/types'
import {
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IsEnum, IsObject, IsString } from 'class-validator'
import { ExternalLinks } from './externalLinks.model'
import { XroadIdentifier } from './xroadIdentifier.model'

@ObjectType()
export class ServiceDetail implements IServiceDetail {
  @Field(() => ID)
  @IsString()
  version!: string

  @Field(() => String)
  @IsString()
  title!: string

  @Field(() => String)
  @IsString()
  summary!: string

  @Field(() => String)
  @IsString()
  description!: string

  @Field(() => TypeCategory)
  @IsEnum(TypeCategory)
  type!: TypeCategory

  @Field(() => [PricingCategory])
  @IsEnum(PricingCategory)
  pricing!: PricingCategory[]

  @Field(() => [DataCategory])
  @IsEnum(DataCategory)
  data!: DataCategory[]

  @Field(() => ExternalLinks)
  @IsObject()
  links!: ExternalLinks

  @Field(() => XroadIdentifier)
  @IsObject()
  xroadIdentifier!: XroadIdentifier
}
