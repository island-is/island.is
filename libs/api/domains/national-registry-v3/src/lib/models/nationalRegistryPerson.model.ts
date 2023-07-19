import { EinstaklingurDTOAllt } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Birthplace } from './nationalRegistryBirthplace.model'
import { Citizenship } from './nationalRegistryCitizenship.model'
import { Spouse } from './nationalRegistrySpouse.model'
import { Address } from './nationalRegistryAddress.model'
import { Name } from './nationalRegistryName.model'
import { Religion } from './nationalRegistryReligion.model'

@ObjectType('NationalRegistryV3Person')
export class Person {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName?: string | null

  @Field(() => String, { nullable: true })
  gender?: string | null

  @Field(() => String, { nullable: true })
  nationalIdType?: string | null

  @Field(() => Boolean, { nullable: true })
  exceptionFromDirectMarketing?: boolean | null

  @Field(() => String, { nullable: true })
  fate?: string | null

  @Field(() => Birthplace, { nullable: true })
  birthplace?: Birthplace | null

  @Field(() => Citizenship, { nullable: true })
  citizenship?: Citizenship | null

  @Field(() => Spouse, { nullable: true })
  spouse?: Spouse | null

  @Field(() => Address, { nullable: true })
  address?: Address | null

  @Field(() => Name, { nullable: true })
  name?: Name | null

  @Field(() => Religion, { nullable: true })
  religion?: Religion | null

  rawData?: EinstaklingurDTOAllt
}

export function formatPerson(
  individual: EinstaklingurDTOAllt | null | undefined,
): Person | null {
  if (individual == null || !individual.kennitala || !individual.nafn) {
    return null
  }
  return {
    nationalId: individual.kennitala,
    fullName: individual.fulltNafn?.fulltNafn ?? null,
    nationalIdType: individual.tegundKennitolu ?? null,
    exceptionFromDirectMarketing: individual.bannmerking === 'true' ?? false,
    fate: individual.afdrif ?? null,
    rawData: individual,
  }
}
