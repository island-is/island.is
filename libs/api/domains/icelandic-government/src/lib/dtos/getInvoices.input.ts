import { PaginationInput } from '@island.is/nest/pagination'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDate, IsInt, IsOptional } from 'class-validator'

@InputType('IcelandicGovernmentInvoicesInput')
export class InvoicesInput extends PaginationInput() {
  @Field(() => Int)
  @IsInt()
  supplier!: number

  @Field(() => Int)
  @IsInt()
  customer!: number

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
}
