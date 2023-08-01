import { EinstaklingurDTOAllt } from '@island.is/clients/national-registry-v3'
import {
  Field,
  ID,
  ObjectType,
  createUnionType,
  registerEnumType,
} from '@nestjs/graphql'
import { NationalRegistryBirthplace } from './nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from './nationalRegistryCitizenship.model'
import { NationalRegistrySpouse } from './nationalRegistrySpouse.model'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'
import { NationalRegistryName } from './nationalRegistryName.model'
import { NationalRegistryReligion } from './nationalRegistryReligion.model'
import { NationalRegistryGender } from '../nationalRegistry.types'
import { NationalRegistryResidence } from './nationalRegistryResidence.model'
import { NationalRegistryBasePerson } from './nationalRegistryBasePerson.model'
import { NationalRegistryLivingArrangements } from './nationalRegistryLivingArrangements.model'
import { NationalRegistryChild } from './nationalRegistryChild.model'

registerEnumType(NationalRegistryGender, { name: 'NationalRegistryGender' })

export type PersonV3 = NationalRegistryPersonV3 & {
  api: 'v3'
  rawData?: EinstaklingurDTOAllt | null
}

export type PersonV2 = NationalRegistryPersonV2 & {
  api: 'v2'
}

export type PersonDiscriminated = PersonV3 | PersonV2

export const NationalRegistryPerson = createUnionType({
  name: 'NationalRegistryPerson',
  types: () => [NationalRegistryPersonV3, NationalRegistryPersonV2],
})

export class NationalRegistryPersonDetailsBase extends NationalRegistryBasePerson {
  @Field(() => NationalRegistryGender, { nullable: true })
  gender?: NationalRegistryGender | null

  @Field(() => String, { nullable: true })
  genderText?: string | null

  @Field(() => String, { nullable: true })
  genderCode?: string | null

  @Field(() => String, { nullable: true })
  nationalIdType?: string | null

  @Field(() => Boolean, { nullable: true })
  exceptionFromDirectMarketing?: boolean | null

  @Field(() => String, { nullable: true })
  fate?: string | null

  @Field(() => NationalRegistryBirthplace, { nullable: true })
  birthplace?: NationalRegistryBirthplace | null

  @Field(() => NationalRegistryCitizenship, { nullable: true })
  citizenship?: NationalRegistryCitizenship | null

  @Field(() => NationalRegistrySpouse, { nullable: true })
  spouse?: NationalRegistrySpouse | null

  @Field(() => NationalRegistryAddress, { nullable: true })
  address?: NationalRegistryAddress | null

  @Field(() => NationalRegistryName, { nullable: true })
  name?: NationalRegistryName | null

  @Field(() => [NationalRegistryReligion], { nullable: true })
  religion?: Array<NationalRegistryReligion> | null
}

export class NationalRegistryPersonV3 extends NationalRegistryPersonDetailsBase {
  @Field(() => [NationalRegistryChild], { nullable: true })
  children?: NationalRegistryChild[]

  @Field(() => NationalRegistryLivingArrangements, { nullable: true })
  livingArrangements?: NationalRegistryLivingArrangements
}

export class NationalRegistryPersonV2 extends NationalRegistryPersonDetailsBase {
  @Field(() => Boolean, { nullable: true })
  livesWithApplicant?: boolean

  @Field(() => Boolean, { nullable: true })
  livesWithBothParents?: boolean

  @Field(() => [NationalRegistryPersonV2], { nullable: true })
  children?: NationalRegistryPersonV2[]

  @Field(() => NationalRegistryPersonV2, { nullable: true })
  otherParent?: NationalRegistryPersonV2 | null

  @Field(() => [NationalRegistryResidence], { nullable: true })
  residenceHistory?: NationalRegistryResidence[]
}
