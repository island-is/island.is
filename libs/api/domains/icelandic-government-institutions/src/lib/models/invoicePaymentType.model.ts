import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsInvoicePaymentType')
export class InvoicePaymentType {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  accountType?: string

  @Field({ nullable: true })
  isConfidential?: boolean
}
