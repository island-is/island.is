import { Application, DataProviderResult } from '@island.is/application/core'

export function getExpectedDateOfBirth(application: Application): string {
  const dataProviderResult = application.externalData
    .expectedDateOfBirth as DataProviderResult
  return dataProviderResult.data as string
}

export function getNameAndIdOfSpouse(
  application: Application,
): [string?, string?] {
  const dataProviderResult = application.externalData
    .spouse as DataProviderResult
  if (!dataProviderResult || dataProviderResult.status === 'failure') {
    // TODO read the correct spouse value
    return ['Jón Jónsson', '123456-7890']
  }
  return [undefined, undefined]
}
