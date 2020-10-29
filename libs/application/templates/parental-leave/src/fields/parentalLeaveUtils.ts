import { Application, DataProviderResult } from '@island.is/application/core'

export function getExpectedDateOfBirth(application: Application): string {
  const dataProviderResult = application.externalData
    .expectedDateOfBirth as DataProviderResult
  return dataProviderResult.data as string
}
