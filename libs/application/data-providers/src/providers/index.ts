import { ExpectedDateOfBirth } from './ExpectedDateOfBirth'
import { ExampleFails } from './ExampleFails'
import { ExampleSucceeds } from './ExampleSucceeds'
import {
  DataProvider,
  DataProviderTypes,
} from '@island.is/application/template'

const typeMap = {
  [DataProviderTypes.ExpectedDateOfBirth]: ExpectedDateOfBirth,
  [DataProviderTypes.ExampleFails]: ExampleSucceeds,
  [DataProviderTypes.ExampleSucceeds]: ExampleFails,
}

export function getDataProviderByType(
  type: DataProviderTypes,
): DataProvider | null {
  const Provider = typeMap[type]
  if (Provider) {
    return new Provider()
  }
  return null
}
