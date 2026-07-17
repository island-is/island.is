import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDate, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'
import { OpenInvoiceSortFields, SortDirections } from './sortEnums'

@InputType('IcelandicGovernmentInstitutionsInvoiceGroupsInput')
export class InvoiceGroupsInput {
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
  suppliers?: string[]

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  debtors?: number[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  ministries?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  paymentTypeIds?: string[]

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  dateFrom?: Date

  @Field({ nullable: true })
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
