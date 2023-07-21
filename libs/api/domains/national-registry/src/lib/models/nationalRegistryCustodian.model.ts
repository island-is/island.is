import {
  EinstaklingurDTOForsjaItem,
  EinstaklingurDTOLoghTengsl,
} from '@island.is/clients/national-registry-v3'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryCustodian {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  custodyCode?: string | null

  @Field(() => String, { nullable: true })
  custodyText?: string | null

  @Field(() => Boolean, { nullable: true })
  livesWithChild?: boolean | null
}

export function formatCustodian(
  custodian: EinstaklingurDTOForsjaItem | null | undefined,
  childDomicileData: EinstaklingurDTOLoghTengsl | null | undefined,
): NationalRegistryCustodian | null {
  if (
    !custodian ||
    !custodian.forsjaAdiliKennitala ||
    !custodian.forsjaAdiliNafn
  ) {
    return null
  }

  return {
    nationalId: custodian.forsjaAdiliKennitala,
    name: custodian.forsjaAdiliNafn,
    custodyCode: custodian.forsjaKodi ?? null,
    custodyText: custodian.forsjaTexti ?? null,
    livesWithChild:
      childDomicileData?.logheimilismedlimir
        ?.map((l) => l.kennitala)
        .includes(custodian.forsjaAdiliKennitala) ?? null,
  }
}
