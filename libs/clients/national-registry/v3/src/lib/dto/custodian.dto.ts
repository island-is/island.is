import {
  EinstaklingurDTOForsjaItem,
  EinstaklingurDTOLoghTengsl,
} from '../../../gen/fetch'

export interface CustodianDto {
  nationalId: string
  name: string
  custodyCode: string | null
  custodyText: string | null
  livesWithChild: boolean | null
}

export function formatCustodianDto(
  custodian?: EinstaklingurDTOForsjaItem | null,
  childDomicileData?: EinstaklingurDTOLoghTengsl | null,
): CustodianDto | null {
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
