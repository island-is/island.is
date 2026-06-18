import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsOptional, IsString } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsInvoiceGroupInput')
export class InvoiceGroupInput {
  @Field()
  @IsString()
  supplierLegalId!: string

  @Field()
  @IsString()
  debtorLegalId!: string

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  dateFrom?: Date

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  dateTo?: Date
}
