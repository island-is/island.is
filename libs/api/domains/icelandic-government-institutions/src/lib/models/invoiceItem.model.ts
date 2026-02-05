import { Field, ID, ObjectType } from '@nestjs/graphql'
import { InvoiceType } from './invoiceType.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceItem')
export class InvoiceItem {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string

  @Field()
  amount!: number

  @Field(() => InvoiceType, { nullable: true })
  invoiceType?: InvoiceType
}
