import { EinstaklingurDTOAllt } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType, ID } from '@nestjs/graphql'

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
