import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsInvoiceGroupInput')
export class InvoiceGroupInput {
  @Field()
  @IsString()
  supplierLegalId!: string

  @Field(() => Int)
  @IsInt()
  erpLegalEntityId!: number

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
  paymentTypeIds?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  ministries?: string[]
}
