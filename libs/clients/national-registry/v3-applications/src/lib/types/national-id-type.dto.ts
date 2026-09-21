import { EinstaklingurTegundDTO } from '../../../gen/fetch'

export interface NationalIdTypeDto {
  nationalId: string
  name: string | null
  registryCode: string | null
  registryDescription: string | null
}

export const formatNationalIdTypeDto = (
  nationalIdType: EinstaklingurTegundDTO | null | undefined,
): NationalIdTypeDto | null => {
  if (nationalIdType == null) {
    return null
  }

  return {
    nationalId: nationalIdType.kennitala,
    name: nationalIdType.nafn || null,
    registryCode: nationalIdType.skraKodi || null,
    registryDescription: nationalIdType.skraLysing || null,
  }
}
