import { Field, ID, ObjectType } from '@nestjs/graphql'
import { InvoiceItemGroup } from './invoiceItemGroup.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoice')
export class Invoice {
  @Field(() => ID)
  cacheId!: number

  @Field({ description: 'Invoice number' })
  number!: string

  @Field()
  seller!: string

  @Field()
  buyer!: string

  @Field()
  amount!: number

  @Field(() => [InvoiceItemGroup])
  itemization!: Array<InvoiceItemGroup>
}
