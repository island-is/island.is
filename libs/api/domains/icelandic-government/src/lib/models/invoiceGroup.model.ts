import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Invoice } from './invoice.model'
import { Entity } from './entity.model'

@ObjectType('IcelandicGovernmentInvoiceGroup', {
  description:
    'Contains every invoice between a unique seller-buyer relationship',
})
export class InvoiceGroup {
  @Field(() => ID)
  id!: string

  @Field(() => Entity)
  supplier!: Entity

  @Field(() => Entity)
  customer!: Entity

  @Field()
  totalAmount!: number

  @Field(() => [Invoice])
  invoices?: Array<Invoice>
}
