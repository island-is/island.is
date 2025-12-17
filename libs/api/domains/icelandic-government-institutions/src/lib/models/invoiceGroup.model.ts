import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { Invoice } from './invoice.model'
import { Supplier } from './supplier.model'
import { Customer } from './customer.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceGroup', {
  description:
    'Contains every invoice between a unique seller-buyer relationship',
})
export class InvoiceGroup {
  @Field(() => ID)
  id!: string

  @Field(() => Supplier)
  supplier!: Supplier

  @Field(() => Customer)
  customer!: Customer

  @Field(() => Int)
  totalPaymentsSum!: number

  @Field(() => Int)
  totalPaymentsCount!: number

  @Field(() => [Invoice], { nullable: true })
  invoices?: Array<Invoice>
}
