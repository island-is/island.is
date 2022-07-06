import { Field, InputType, ID, Int } from '@nestjs/graphql'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetApiServiceInput {
  @Field(() => ID)
  @IsString()
  id!: string
}

@InputType()
export class GetApiCatalogueInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  limit?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cursor?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  query?: string

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  pricing?: Array<string>

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  data?: Array<string>

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  type?: Array<string>

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  access?: Array<string>
}
