import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LandBeneficiary } from './landBeneficiary.model'
import { LandRegistryEntry } from './landRegistryEntry.model'

@ObjectType()
export class FarmerLand {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string

  @Field(() => [LandBeneficiary], { nullable: true })
  beneficiaries?: LandBeneficiary[]

  @Field(() => [LandRegistryEntry], { nullable: true })
  landRegistry?: LandRegistryEntry[]
}
