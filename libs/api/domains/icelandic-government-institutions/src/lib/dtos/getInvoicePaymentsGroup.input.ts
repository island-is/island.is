import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'
import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql'

@InputType('IcelandicGovernmentInstitutionsInvoicePaymentsGroupInput')
export class InvoicePaymentsGroupInput {
  @Field()
  @IsString()
  @MaxLength(50)
  supplierLegalId!: string

  @Field()
  @IsUUID()
  debtorId!: string

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
