import { EinstaklingurDTOAllt } from '@island.is/clients/national-registry-v3'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { NationalRegistryBirthplace } from './nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from './nationalRegistryCitizenship.model'
import { NationalRegistrySpouse } from './nationalRegistrySpouse.model'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'
import { NationalRegistryName } from './nationalRegistryName.model'
import { NationalRegistryReligion } from './nationalRegistryReligion.model'

type PersonV3 = NationalRegistryPerson & {
  api: 'v3'
  rawData?: EinstaklingurDTOAllt
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
  fullName?: string | null

  @Field(() => String, { nullable: true })
  gender?: string | null

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

  @Field(() => NationalRegistryReligion, { nullable: true })
  religion?: NationalRegistryReligion | null
}

export function formatUser(
  individual: EinstaklingurDTOAllt | null | undefined,
): NationalRegistryPersonDiscriminated | null {
  if (individual == null || !individual.kennitala || !individual.nafn) {
    return null
  }
  return {
    nationalId: individual.kennitala,
    fullName: individual.fulltNafn?.fulltNafn ?? null,
    nationalIdType: individual.tegundKennitolu ?? null,
    exceptionFromDirectMarketing: individual.bannmerking === 'true' ?? false,
    gender: individual.kyn?.kynTexti,
    genderCode: individual.kyn?.kynKodi,
    fate: individual.afdrif ?? null,
    api: 'v3',
    rawData: individual,
  }
}
