import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInvoiceItem')
export class InvoiceItem {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string

  @Field()
  amount!: number
}
