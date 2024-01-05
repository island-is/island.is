import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'
import { NationalRegistryBirthplace } from './nationalRegistryBirthplace.model'
import { NationalRegistryResidence } from './nationalRegistryResidence.model'
import { NationalRegistrySpouse } from './nationalRegistrySpouse.model'
import { NationalRegistryCitizenship } from './nationalRegistryCitizenship.model'

@ObjectType('NationalRegistryXRoadPerson')
export class NationalRegistryPerson {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String)
  genderCode!: string

  @Field(() => NationalRegistryAddress, { nullable: true })
  address?: NationalRegistryAddress | null

  @Field(() => Boolean, { nullable: true })
  livesWithApplicant?: boolean

  @Field(() => Boolean, { nullable: true })
  livesWithBothParents?: boolean

  @Field(() => [NationalRegistryPerson], { nullable: true })
  children?: NationalRegistryPerson[]

  @Field(() => NationalRegistryPerson, { nullable: true })
  otherParent?: NationalRegistryPerson | null

  @Field(() => [NationalRegistryResidence], { nullable: true })
  residenceHistory?: NationalRegistryResidence[]

  @Field(() => NationalRegistrySpouse, { nullable: true })
  spouse?: NationalRegistrySpouse | null

  @Field(() => NationalRegistryBirthplace, { nullable: true })
  birthplace?: NationalRegistryBirthplace | null

  @Field(() => NationalRegistryCitizenship, { nullable: true })
  citizenship?: NationalRegistryCitizenship | null
}
