import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceType')
export class InvoiceType {
  @Field()
  code!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  description?: string
}
