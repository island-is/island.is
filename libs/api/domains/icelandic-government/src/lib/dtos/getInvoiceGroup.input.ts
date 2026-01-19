import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDate, IsOptional } from 'class-validator'

@InputType('IcelandicGovernmentInvoiceGroupInput')
export class InvoiceGroupInput {
  @Field(() => Int)
  supplier!: number

  @Field(() => Int)
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
