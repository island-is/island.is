import { EstateRegistrant } from '@island.is/clients/syslumenn'

export function isEstateRegistrant(
  data: string | number | boolean | object | undefined,
): data is { estate: EstateRegistrant } {
  return (
    (data as { estate: EstateRegistrant }).estate.nameOfDeceased !== undefined
  )
}
