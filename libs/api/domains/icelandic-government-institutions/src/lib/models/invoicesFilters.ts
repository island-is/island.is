import { Field, ObjectType } from '@nestjs/graphql'
import { Customers } from './customers.model'
import { InvoicePaymentTypes } from './invoicePaymentTypes.model'
import { Suppliers } from './suppliers.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoicesFilters')
export class InvoicesFilters {
  @Field(() => Customers, { nullable: true })
  customers?: Customers

  @Field(() => Suppliers, { nullable: true })
  suppliers?: Suppliers

  @Field(() => InvoicePaymentTypes, { nullable: true })
  invoicePaymentTypes?: InvoicePaymentTypes
}
