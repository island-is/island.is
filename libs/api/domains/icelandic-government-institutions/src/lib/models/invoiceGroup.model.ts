import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Invoice } from './invoice.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceGroup', {
  description:
    'Contains every invoice between a unique seller-buyer relationship',
})
export class InvoiceGroup {
  @Field(() => ID)
  id!: string

  @Field()
  seller!: string

  @Field()
  buyer!: string

  @Field()
  totalAmount!: number

  @Field(() => [Invoice])
  invoices!: Array<Invoice>
}
