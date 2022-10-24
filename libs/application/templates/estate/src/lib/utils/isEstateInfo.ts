import { EstateInfo } from '@island.is/clients/syslumenn'

export function isEstateInfo(
  data: string | number | boolean | object | undefined,
): data is { estate: EstateInfo } {
  return (data as { estate: EstateInfo }).estate.nameOfDeceased !== undefined
}
