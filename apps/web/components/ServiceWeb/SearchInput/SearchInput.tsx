import React, { useMemo, useState } from 'react'
import { AsyncSearch, AsyncSearchOption } from '@island.is/island-ui/core'

import * as styles from './SearchInput.treat'
import { useLazyQuery } from '@apollo/client'
import { FRESHDESK_SEARCH } from '../../../screens/queries/Freshdesk'
import {
  FreshdeskSearchQuery,
  FreshdeskSearchQueryVariables,
} from '@island.is/web/graphql/schema'

interface SearchInputProps {
  title?: string
  logoTitle?: string
  logoUrl?: string
}

export const SearchInput = ({
  title = '',
  logoTitle = '',
  logoUrl,
}: SearchInputProps) => {
  const [searchTerms, setSearchTerms] = useState<string>('')

  const [doSearch, { data, loading, called, error }] = useLazyQuery<
    FreshdeskSearchQuery,
    FreshdeskSearchQueryVariables
  >(FRESHDESK_SEARCH, {
    variables: {
      input: {
        terms: searchTerms,
      },
    },
  })

  useMemo(() => {
    if (searchTerms) {
      doSearch()
    }
  }, [searchTerms])

  const options =
    data?.freshdeskSearch?.map(({ title }, index) => {
      return {
        label: title,
        value: title,
      } as AsyncSearchOption
    }) ?? []

  return (
    <AsyncSearch
      size="large"
      key="ok"
      options={options}
      inputValue={searchTerms}
      onInputValueChange={(value) => setSearchTerms(value)}
      placeholder="Leitaðu á þjónustuvefnum"
    />
  )
}

export default SearchInput
