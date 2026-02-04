import { Field, ObjectType } from '@nestjs/graphql'
import { Customers } from './customers.model'
import { InvoiceTypes } from './invoiceTypes.model'
import { Suppliers } from './suppliers.model'

@ObjectType('IcelandicGovernmentInvoicesFilters')
export class InvoicesFilters {
  @Field(() => Customers, { nullable: true })
  customers?: Customers

  @Field(() => Suppliers, { nullable: true })
  suppliers?: Suppliers

  @Field(() => InvoiceTypes, { nullable: true })
  invoiceTypes?: InvoiceTypes
}
