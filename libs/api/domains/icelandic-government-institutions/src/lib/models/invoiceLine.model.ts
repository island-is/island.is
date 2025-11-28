import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceLine')
export class InvoiceLine {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string

  @Field()
  amount!: number
}
