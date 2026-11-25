import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsInvoicePaymentTypeGroup')
export class InvoicePaymentTypeGroup {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => [String], {
    description:
      'The underlying payment type codes this group covers. Flatten these into `paymentTypeIds` when querying invoice payments groups. These are also what the `lookup` input matches — not `id`.',
  })
  codes!: string[]

  @Field(() => Int, {
    nullable: true,
    description:
      'Authoritative number of underlying payment type codes in this group, as reported by the source system. May exceed the length of `codes`.',
  })
  codeCount?: number

  @Field({
    nullable: true,
    description: 'The level 3 category name for this group.',
  })
  l3CategoryName?: string
}
