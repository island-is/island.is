import {
  Field,
  Float,
  GraphQLISODateTime,
  InputType,
  Int,
} from '@nestjs/graphql'
import { IsDate, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator'

@InputType('ShipRegistrySeagoingTimeInput')
export class SeagoingTimeInput {
  @IsOptional()
  @IsDate()
  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @IsOptional()
  @IsDate()
  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date

  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true })
  rankId?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field(() => Float, { nullable: true })
  minimumLength?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field(() => Float, { nullable: true })
  minimumEnginePower?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field(() => Float, { nullable: true })
  minimumGrossTonnage?: number

  @IsInt()
  @Min(1)
  @Field(() => Int)
  pageNumber!: number

  @IsInt()
  @Min(1)
  @Max(100)
  @Field(() => Int)
  pageSize!: number
}
