import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryPerson {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => NationalRegistryAddress)
  address?: NationalRegistryAddress

  @Field(() => Boolean)
  livesWithApplicant?: Boolean

  @Field(() => Boolean)
  livesWithBothParents?: Boolean

  @Field(() => [NationalRegistryPerson])
  children?: NationalRegistryPerson[]

  @Field(() => [NationalRegistryPerson])
  parents?: NationalRegistryPerson[]
}
