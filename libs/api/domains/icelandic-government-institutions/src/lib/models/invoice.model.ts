import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { InvoiceItem } from './invoiceItem.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoice')
export class Invoice {
  @Field(() => ID)
  id!: string

  @Field({ description: 'ISO8601' })
  date!: string

  @Field(() => Int)
  totalItemizationAmount!: number

  @Field(() => [InvoiceItem], { nullable: true })
  itemizations?: InvoiceItem[]
}
