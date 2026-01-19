import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Invoice } from './invoice.model'
import { Supplier } from './supplier.model'
import { Customer } from './customer.model'

@ObjectType('IcelandicGovernmentInvoiceGroupWithInvoices', {
  description:
    'Contains every invoice between a unique seller-buyer relationship',
})
export class InvoiceGroupWithInvoices {
  @Field(() => ID)
  id!: string

  @Field(() => Supplier)
  supplier!: Supplier

  @Field(() => Customer)
  customer!: Customer

  @Field(() => [Invoice])
  invoices!: Invoice[]
}
