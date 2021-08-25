import React, { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import {
  AsyncSearch,
  AsyncSearchOption,
  AsyncSearchProps,
} from '@island.is/island-ui/core'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface SearchInputProps {
  title?: string
  size?: AsyncSearchProps['size']
  logoTitle?: string
  logoUrl?: string
  colored?: boolean
  initialInputValue?: string
}

export const SearchInput = ({
  title = '',
  logoTitle = '',
  logoUrl,
  colored = false,
  size = 'large',
  initialInputValue = '',
}: SearchInputProps) => {
  const timerRef = useRef(null)
  const [isBusy, setIsBusy] = useState<boolean>(false)
  const [searchTerms, setSearchTerms] = useState<string>('')
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()

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
      initialInputValue={initialInputValue}
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
