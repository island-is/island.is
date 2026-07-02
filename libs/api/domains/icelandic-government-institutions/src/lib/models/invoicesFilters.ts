import { Field, ObjectType } from '@nestjs/graphql'
import { Debtors } from './debtors.model'
import { InvoicePaymentTypes } from './invoicePaymentTypes.model'
import { Ministries } from './ministries.model'
import { Suppliers } from './suppliers.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoicesFilters')
export class InvoicesFilters {
  @Field(() => Debtors, { nullable: true })
  debtors?: Debtors

  @Field(() => Suppliers, { nullable: true })
  suppliers?: Suppliers

  @Field(() => InvoicePaymentTypes, { nullable: true })
  invoicePaymentTypes?: InvoicePaymentTypes

  @Field(() => Ministries, { nullable: true })
  ministries?: Ministries
}
