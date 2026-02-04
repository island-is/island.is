import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInvoiceType')
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
