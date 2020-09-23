import { Field, InputType, ID } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

@InputType()
export class GetApiServiceInput {
  @Field(() => ID)
  @IsString()
  id: string
}

@InputType()
export class GetApiCataloguesInput {
  @Field((type) => Number)
  @IsNumber()
  limit: number

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  cursor?: string

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  owner?: string

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field((type) => PricingCategory, { nullable: true })
  @IsOptional()
  @IsEnum(PricingCategory)
  pricing?: PricingCategory

  @Field((type) => DataCategory, { nullable: true })
  @IsOptional()
  @IsEnum(DataCategory)
  data?: DataCategory

  @Field((type) => TypeCategory, { nullable: true })
  @IsOptional()
  @IsEnum(TypeCategory)
  type?: TypeCategory

  @Field((type) => AccessCategory, { nullable: true })
  @IsOptional()
  @IsEnum(AccessCategory)
  access?: AccessCategory
}
