import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { OpenInvoiceSortFields, SortDirections } from './sortEnums'

@InputType('IcelandicGovernmentInstitutionsInvoicePaymentsGroupsInput')
export class InvoicePaymentsGroupsInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suppliers?: string[]

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  debtors?: number[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ministries?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paymentTypeIds?: string[]

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  @IsOptional()
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  @IsOptional()
  dateTo?: Date

  @Field(() => OpenInvoiceSortFields, { nullable: true })
  @IsOptional()
  @IsEnum(OpenInvoiceSortFields)
  sortBy?: OpenInvoiceSortFields

  @Field(() => SortDirections, { nullable: true })
  @IsOptional()
  @IsEnum(SortDirections)
  sortDirection?: SortDirections
}
