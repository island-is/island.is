import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'
import { IsArray, IsDate, IsInt, IsOptional, IsString } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsInvoicePaymentsGroupInput')
export class InvoicePaymentsGroupInput {
  @Field()
  @IsString()
  supplierLegalId!: string

  @Field(() => Int)
  @IsInt()
  erpLegalEntityId!: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  @IsOptional()
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  @IsOptional()
  dateTo?: Date

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paymentTypeIds?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ministries?: string[]
}
