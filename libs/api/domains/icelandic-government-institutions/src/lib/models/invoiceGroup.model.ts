import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { Invoice } from './invoice.model'
import { Supplier } from './supplier.model'
import { Debtor } from './debtor.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceGroup')
export class InvoiceGroup {
  @Field(() => ID)
  id!: string

  @Field(() => Supplier)
  supplier!: Supplier

  @Field(() => Debtor)
  debtor!: Debtor

  @Field(() => Int)
  totalSum!: number

  @Field(() => Int)
  totalCount!: number

  @Field(() => [Invoice], { nullable: true })
  invoices?: Invoice[]
}
