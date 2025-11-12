import { useMemo } from 'react'

import { QueryHookOptions } from '@apollo/client'

import { useFeatureFlag } from '../contexts/feature-flag-provider'
import {
  GenericLicenseType,
  GetGenericLicensesInput,
  ListLicensesQuery,
  ListLicensesQueryVariables,
  GenericUserLicense,
  useListLicensesQuery,
} from '../graphql/types/schema'
import { INCLUDED_LICENSE_TYPES } from '../screens/wallet-pass/wallet-pass.constants'
import { useLocale } from './use-locale'

type UseLicensesQueryOptions = Omit<
  QueryHookOptions<ListLicensesQuery, ListLicensesQueryVariables>,
  'variables'
> & {
  input?: Omit<GetGenericLicensesInput, 'includedTypes'>
  locale?: string
}

export const useIncludedLicenseTypes = () => {
  const isIdentityDocumentEnabled = useFeatureFlag(
    'isIdentityDocumentEnabled',
    false,
  )

  const includedTypes = useMemo(
    () => [
      ...INCLUDED_LICENSE_TYPES,
      ...(isIdentityDocumentEnabled
        ? [GenericLicenseType.IdentityDocument]
        : []),
    ],
    [isIdentityDocumentEnabled],
  )

  return { includedTypes, isIdentityDocumentEnabled }
}

export const useLicensesQuery = ({
  input,
  locale,
  ...options
}: UseLicensesQueryOptions = {}) => {
  const { includedTypes } = useIncludedLicenseTypes()
  const fallbackLocale = useLocale()

  const queryResult = useListLicensesQuery({
    ...options,
    variables: {
      input: {
        ...input,
        includedTypes,
      },
      locale: locale ?? fallbackLocale,
    },
  })

  // Filter out undefined licenses
  const licenses = useMemo<GenericUserLicense[]>(() => {
    return (
      (queryResult.data?.genericLicenseCollection?.licenses?.filter((license) =>
        Boolean(license),
      ) as GenericUserLicense[]) ?? []
    )
  }, [queryResult.data?.genericLicenseCollection?.licenses])

  return {
    ...queryResult,
    licenses,
  }
}
