import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'
import { Payment } from './payment.model'
import { Supplier } from './supplier.model'
import { Debtor } from './debtor.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoicePaymentsGroup')
export class InvoicePaymentsGroup {
  @Field(() => ID)
  id!: string

  @Field(() => Supplier)
  supplier!: Supplier

  @Field(() => Debtor)
  debtor!: Debtor

  @Field(() => Float)
  totalPaymentsSum!: number

  @Field(() => Int)
  totalPaymentsCount!: number

  @Field(() => [Payment], { nullable: true })
  payments?: Payment[]
}
