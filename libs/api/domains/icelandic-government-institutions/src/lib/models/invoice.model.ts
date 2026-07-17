import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { InvoiceItem } from './invoiceItem.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoice')
export class Invoice {
  @Field(() => ID)
  id!: string

  @Field({ description: 'ISO8601' })
  date!: string

  @Field(() => Float)
  totalItemizationAmount!: number

  @Field(() => [InvoiceItem], { nullable: true })
  itemizations?: InvoiceItem[]
}
