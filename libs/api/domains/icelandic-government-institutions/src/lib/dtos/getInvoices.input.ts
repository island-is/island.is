import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsOptional, IsString } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsInvoicesInput')
export class InvoicesInput {
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
