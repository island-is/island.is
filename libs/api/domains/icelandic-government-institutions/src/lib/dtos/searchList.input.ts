import { PaginationInput } from '@island.is/nest/pagination'
import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { SortDirections } from './sortEnums'

@InputType({ isAbstract: true })
export abstract class SearchListInput extends PaginationInput() {
  @Field(() => Int, {
    nullable: true,
    description: 'Maximum number of results to return. Capped at 100.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  override limit?: number

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string

  @Field(() => [String], {
    nullable: true,
    description:
      'Optional list of exact IDs/codes to look up directly, e.g. to resolve labels for already-selected filter values.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lookup?: string[]

  @Field(() => SortDirections, { nullable: true })
  @IsOptional()
  @IsEnum(SortDirections)
  sortDirection?: SortDirections
}
