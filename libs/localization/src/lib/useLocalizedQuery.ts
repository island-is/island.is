import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  useQuery,
} from '@apollo/client'
import { useEffect, useRef } from 'react'

import useLocale from './useLocale'

interface LocalizedOperationVariables {
  locale: string
}

export const useLocalizedQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>,
) => {
  const { lang: locale } = useLocale()
  const currentLocale = useRef(locale)
  const result = useQuery(query, {
    ...options,
    variables: {
      ...options?.variables,
      locale,
    } as TVariables & LocalizedOperationVariables,
  })

  useEffect(() => {
    if (locale !== currentLocale.current) {
      currentLocale.current = locale
      result.refetch?.()
    }
  }, [locale])

  return result
}
