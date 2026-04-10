import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsInt, IsOptional } from 'class-validator'
import {
  FarmerLandSubsidyOrderDirection,
  FarmerLandSubsidyOrderField,
} from '../models/enums'

@InputType()
export class FarmerLandSubsidiesInput {
  @Field(() => ID)
  farmId!: string

  @Field({
    nullable: true,
    description:
      'Pagination cursor. Accepts both the next and previous cursor tokens returned by the API — pass endCursor to go forward, startCursor to go backward.',
  })
  cursor?: string

  @Field(() => FarmerLandSubsidyOrderField, { nullable: true })
  @IsOptional()
  @IsEnum(FarmerLandSubsidyOrderField)
  orderField?: FarmerLandSubsidyOrderField

  @Field(() => FarmerLandSubsidyOrderDirection, {
    nullable: true,
    description:
      'Sort direction. Only has effect when orderField is also provided. Defaults to ascending.',
  })
  @IsOptional()
  @IsEnum(FarmerLandSubsidyOrderDirection)
  orderDirection?: FarmerLandSubsidyOrderDirection

  @Field(() => Int, {
    nullable: true,
    description:
      'Filter by payment category ID. Options available in filterOptions.',
  })
  @IsOptional()
  @IsInt()
  paymentCategoryId?: number

  @Field({
    nullable: true,
    description: 'Filter by contract ID. Options available in filterOptions.',
  })
  @IsOptional()
  contractId?: string

  @Field({
    nullable: true,
    description: 'Filter payments from this date (inclusive).',
  })
  @IsOptional()
  dateFrom?: Date

  @Field({
    nullable: true,
    description: 'Filter payments to this date (inclusive).',
  })
  @IsOptional()
  dateTo?: Date
}
