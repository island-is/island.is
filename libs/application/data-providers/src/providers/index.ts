import { ExpectedDateOfBirth } from './ExpectedDateOfBirth'
import { ExampleSucceeds } from './ExampleSucceeds'
import { DataProvider, DataProviderTypes } from '@island.is/application/schema'

const typeMap = {
  [DataProviderTypes.ExpectedDateOfBirth]: ExpectedDateOfBirth,
  [DataProviderTypes.ExampleSucceeds]: ExampleSucceeds,
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
