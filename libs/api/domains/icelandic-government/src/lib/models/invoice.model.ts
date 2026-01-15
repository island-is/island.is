import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { InvoiceItem } from './invoiceItem.model'

@ObjectType('IcelandicGovernmentInvoice')
export class Invoice {
  @Field(() => ID)
  id!: number

  @Field({ description: 'ISO8601' })
  date!: string

  @Field(() => [InvoiceItem])
  itemization!: InvoiceItem[]

  @Field(() => Int)
  totalItemizationAmount!: number
}
