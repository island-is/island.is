import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDate, IsOptional } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsInvoiceGroupInput')
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

  @Field(() => [String], { nullable: true })
  @IsOptional()
  types?: string[]
}
