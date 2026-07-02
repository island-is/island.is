import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sortBy?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sortDirection?: string
}
