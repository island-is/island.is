import { PaginationInput } from '@island.is/nest/pagination'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDate, IsOptional } from 'class-validator'

@InputType('IcelandicGovernmentInvoicesInput')
export class InvoicesInput extends PaginationInput() {
  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  dateFrom?: Date

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  dateTo?: Date

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  types?: number[]

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  suppliers?: number[]

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  customers?: number[]
}
