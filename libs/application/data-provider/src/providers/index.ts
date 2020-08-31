import { ExpectedDateOfBirth } from './ExpectedDateOfBirth'
import { DataProvider, DataProviderTypes } from '../lib/DataProvider'

const typeMap = {
  [DataProviderTypes.EXPECTED_DATE_OF_BIRTH]: ExpectedDateOfBirth,
}

export function getDataProviderByType(
  type: DataProviderTypes,
  constructorParams: unknown,
): DataProvider | null {
  const Provider = typeMap[type]
  if (Provider) {
    return new Provider(constructorParams)
  }
  return null
}
