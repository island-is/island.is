import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'
import { NationalRegistryResidence } from './nationalRegistryResidence.model'

@ObjectType()
export class NationalRegistryPerson {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => NationalRegistryAddress, { nullable: true })
  address?: NationalRegistryAddress

  @Field(() => Boolean, { nullable: true })
  livesWithApplicant?: Boolean

  @Field(() => Boolean, { nullable: true })
  livesWithBothParents?: Boolean

  @Field(() => [NationalRegistryPerson], { nullable: true })
  children?: NationalRegistryPerson[]

  @Field(() => NationalRegistryPerson, { nullable: true })
  otherParent?: NationalRegistryPerson

  @Field(() => [NationalRegistryResidence], { nullable: true })
  residenceHistory?: NationalRegistryResidence[]
}
