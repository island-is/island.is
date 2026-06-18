import { PaginationInput } from '@island.is/nest/pagination'
import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsOptional, IsString } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsInvoiceGroupsInput')
export class InvoiceGroupsInput extends PaginationInput() {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  suppliers?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  debtors?: string[]

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
