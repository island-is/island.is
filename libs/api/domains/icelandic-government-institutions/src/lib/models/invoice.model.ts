import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { InvoiceItem } from './invoiceItem.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoice')
export class Invoice {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  number?: string

  @Field({ nullable: true })
  numberRedacted?: boolean

  @Field(() => Float)
  totalAmount!: number

  @Field(() => [InvoiceItem], { nullable: true })
  itemizations?: InvoiceItem[]
}
