import type { ExternalData } from '@island.is/application/types'

export const getSuccessfulExternalData = <TData>(
  externalData: ExternalData | undefined,
  key: string,
  isData: (data: unknown) => data is TData,
): TData | undefined => {
  const entry = externalData?.[key]

  if (entry?.status !== 'success') {
    return undefined
  }

  return isData(entry.data) ? entry.data : undefined
}

export const hasSuccessfulExternalData = <TData>(
  externalData: ExternalData | undefined,
  key: string,
  isData: (data: unknown) => data is TData,
): boolean => getSuccessfulExternalData(externalData, key, isData) !== undefined
