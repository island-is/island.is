import { EinstaklingurDTOHju } from '@island.is/clients/national-registry-v3'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistrySpouse {
  @Field(() => ID, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  maritalStatus?: string | null

  @Field(() => String, { nullable: true })
  cohabitation?: string | null
}

export function formatSpouse(
  spouse: EinstaklingurDTOHju | null | undefined,
): NationalRegistrySpouse | null {
  if (!spouse || !spouse.makiKennitala || !spouse.makiNafn) {
    return null
  }

  return {
    nationalId: spouse.makiKennitala,
    name: spouse.makiNafn,
    maritalStatus: spouse.hjuskaparstadaTexti ?? null,
    cohabitation: spouse.sambudTexti ?? null,
  }
}
