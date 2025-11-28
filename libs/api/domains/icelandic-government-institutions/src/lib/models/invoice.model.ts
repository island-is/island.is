import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { InvoiceLine } from './invoiceLine.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoice')
export class Invoice {
  @Field(() => ID)
  id!: number

  @Field({ description: 'ISO8601' })
  date!: string

  @Field(() => [InvoiceLine])
  lines!: InvoiceLine[]

  @Field(() => Int)
  totalItemizationAmount!: number
}
