import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { InvoicePaymentType } from './invoicePaymentType.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceItem')
export class InvoiceItem {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string

  @Field(() => Float)
  amount!: number

  @Field(() => InvoicePaymentType, { nullable: true })
  invoicePaymentType?: InvoicePaymentType
}
