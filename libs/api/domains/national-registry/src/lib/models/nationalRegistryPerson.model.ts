import { EinstaklingurDTOAllt } from '@island.is/clients/national-registry-v3'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { NationalRegistryBirthplace } from './nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from './nationalRegistryCitizenship.model'
import { NationalRegistrySpouse } from './nationalRegistrySpouse.model'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'
import { NationalRegistryName } from './nationalRegistryName.model'
import { NationalRegistryReligion } from './nationalRegistryReligion.model'
import { NationalRegistryResidenceInfo } from './nationalRegistryResidenceInfo.model'
import { NationalRegistryResidenceHistoryEntry } from './nationalRegistryResidenceHistoryEntry.model'

type PersonV3 = NationalRegistryPerson & {
  api: 'v3'
  rawData?: EinstaklingurDTOAllt | null
}

type PersonV2 = NationalRegistryPerson & {
  api: 'v2'
}

export type NationalRegistryPersonDiscriminated = PersonV3 | PersonV2

@ObjectType('NationalRegistryPerson')
export class NationalRegistryPerson {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName!: string | null

  @Field(() => String, { nullable: true })
  gender?: string | null

  @Field(() => String, { nullable: true })
  genderCode?: string | null

  @Field(() => String, { nullable: true })
  nationalIdType?: string | null

  @Field(() => Boolean, { nullable: true })
  exceptionFromDirectMarketing?: boolean | null

  @Field(() => Boolean, { nullable: true })
  livesWithApplicant?: boolean

  @Field(() => Boolean, { nullable: true })
  livesWithBothParents?: boolean

  @Field(() => [NationalRegistryPerson], { nullable: true })
  children?: NationalRegistryPerson[]

  @Field(() => NationalRegistryPerson, { nullable: true })
  otherParent?: NationalRegistryPerson | null

  @Field(() => String, { nullable: true })
  fate?: string | null

  @Field(() => [NationalRegistryResidenceHistoryEntry], { nullable: true })
  residenceHistory?: NationalRegistryResidenceHistoryEntry[]

  @Field(() => NationalRegistryResidenceInfo, { nullable: true })
  residenceInfo?: NationalRegistryResidenceInfo

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
