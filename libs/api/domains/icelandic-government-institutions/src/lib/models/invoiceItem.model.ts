import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceItem')
export class InvoiceItem {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string

  @Field()
  amount!: number
}
