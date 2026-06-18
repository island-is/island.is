import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsSupplier')
export class Supplier {
  @Field(() => ID, { description: 'Legal ID (kennitala) of the supplier' })
  id!: string

  @Field()
  name!: string

  @Field()
  isPrivateProxy!: boolean

  @Field()
  isConfidential!: boolean
}
