import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsSupplier')
export class Supplier {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string

  @Field()
  isPrivateProxy!: boolean

  @Field()
  isConfidential!: boolean
}
