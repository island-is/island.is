import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { Invoice } from './invoice.model'
import { Supplier } from './supplier.model'
import { Customer } from './customer.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceGroup')
export class InvoiceGroup {
  @Field(() => ID)
  id!: string

  @Field(() => Supplier)
  supplier!: Supplier

  @Field(() => Customer)
  customer!: Customer

  @Field(() => Int)
  totalSum!: number

  @Field(() => Int)
  totalCount!: number

  @Field(() => [Invoice], { nullable: true })
  invoices?: Invoice[]
}
