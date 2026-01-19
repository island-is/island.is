import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { Supplier } from './supplier.model'
import { Customer } from './customer.model'

@ObjectType('IcelandicGovernmentInvoiceGroup', {
  description: 'Describes the relationship between a unique seller-buyer',
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
}
