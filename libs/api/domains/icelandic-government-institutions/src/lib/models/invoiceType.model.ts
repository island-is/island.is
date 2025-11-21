import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceType')
export class InvoiceType {
  @Field(() => ID)
  id!: number

  @Field()
  code!: string

  @Field()
  name!: string

  @Field()
  description!: string
}
