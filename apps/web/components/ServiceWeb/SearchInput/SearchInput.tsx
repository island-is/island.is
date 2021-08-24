import React, { useMemo, useRef, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import {
  AsyncSearch,
  AsyncSearchOption,
  AsyncSearchProps,
} from '@island.is/island-ui/core'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

const DEBOUNCE_TIMER = 600

interface SearchInputProps {
  title?: string
  size?: AsyncSearchProps['size']
  logoTitle?: string
  logoUrl?: string
  colored?: boolean
}

export const SearchInput = ({
  title = '',
  logoTitle = '',
  logoUrl,
  colored = false,
  size = 'large',
}: SearchInputProps) => {
  const timerRef = useRef(null)
  const [isBusy, setIsBusy] = useState<boolean>(false)
  const [searchTerms, setSearchTerms] = useState<string>('')
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()

  //useMemo(() => {
  //  clearTimeout(timerRef.current)

  //  if (searchTerms) {
  //    console.log('first search!', searchTerms)
  //  } else {
  //    timerRef.current = setTimeout(() => {
  //      console.log('doing new search!', searchTerms)
  //    }, DEBOUNCE_TIMER)
  //  }
  //}, [searchTerms])

  const options =
    [].map(({ title }, index) => {
      return {
        label: title,
        value: title,
      } as AsyncSearchOption
    }) ?? []

  return (
    <AsyncSearch
      size={size}
      colored={colored}
      key="island-helpdesk"
      placeholder="Leitaðu á þjónustuvefnum"
      options={options}
      inputValue={searchTerms}
      onInputValueChange={(value) => setSearchTerms(value)}
      onSubmit={(value) => {
        Router.push({
          pathname: linkResolver('helpdesksearch').href,
          query: { q: value },
        })
      }}
    />
  )
}

export default SearchInput
