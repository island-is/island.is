import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsInvoice')
export class Invoice {
  @Field(() => ID)
  cacheId!: number

  @Field({description: 'Invoice number'})
  number!: string
}
