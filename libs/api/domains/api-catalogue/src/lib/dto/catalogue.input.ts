import { Field, InputType, ID } from '@nestjs/graphql'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
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
export class GetApiCatalogueInput {
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
  query?: string

  @Field((type) => [PricingCategory], { nullable: true })
  @IsOptional()
  @IsArray()
  pricing?: PricingCategory[]

  @Field((type) => [DataCategory], { nullable: true })
  @IsOptional()
  @IsArray()
  data?: DataCategory[]

  @Field((type) => [TypeCategory], { nullable: true })
  @IsOptional()
  @IsArray()
  type?: TypeCategory[]

  @Field((type) => [AccessCategory], { nullable: true })
  @IsOptional()
  @IsArray()
  access?: AccessCategory[]
}
