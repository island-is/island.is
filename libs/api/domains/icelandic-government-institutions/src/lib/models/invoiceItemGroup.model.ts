import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { InvoiceItem } from './invoiceItem.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceItemGroup')
export class InvoiceItemGroup {
  @Field(() => ID)
  cacheId!: number

  @Field()
  id!: string

  @Field({description: 'ISO8601'})
  date!: string

  @Field(() => [InvoiceItem])
  items!: InvoiceItem[]

  @Field(() => Int)
  totalItemAmount!: number
}
