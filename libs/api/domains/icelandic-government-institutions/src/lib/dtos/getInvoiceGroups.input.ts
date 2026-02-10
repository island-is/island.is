import { PaginationInput } from '@island.is/nest/pagination'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDate, IsOptional } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsInvoiceGroupsInput')
export class InvoiceGroupsInput extends PaginationInput() {
  @Field(() => [Int], { nullable: true })
  @IsOptional()
  suppliers?: number[]

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  customers?: number[]

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  dateFrom?: Date

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  dateTo?: Date

  @Field(() => [String], { nullable: true })
  @IsOptional()
  types?: string[]
}
