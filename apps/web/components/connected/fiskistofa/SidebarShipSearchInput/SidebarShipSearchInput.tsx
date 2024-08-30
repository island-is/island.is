import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AsyncSearchInput, Box, Text } from '@island.is/island-ui/core'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'

import { translation as translationStrings } from './translation.strings'

const SidebarShipSearchInput = () => {
  const { formatMessage } = useIntl()
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const [hasFocus, setHasFocus] = useState(false)

  const search = () => {
    const searchValueIsNumber =
      !isNaN(Number(searchValue)) && searchValue.length > 0
    if (searchValueIsNumber) {
      const pathname = formatMessage(translationStrings.shipDetailsHref)
      const query = {
        ...router.query,
        [formatMessage(translationStrings.shipDetailsNumberQueryParam)]:
          searchValue,
        selectedTab: router.query?.selectedTab ?? 'skip',
      }

      const params = new URLSearchParams()

      for (const [name, value] of Object.entries(query)) {
        params.append(name, value as string)
      }

      const url = `${pathname}?${params}`

      if (shouldLinkOpenInNewWindow(pathname)) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        router.push(url)
      }
    } else {
      const query = { ...router.query, name: searchValue }
      router.push({
        pathname: formatMessage(translationStrings.shipSearchHref),
        query,
      })
    }
  }

  const label = formatMessage(translationStrings.label)
  const placeholder = formatMessage(translationStrings.placeholder)

  return (
    <Box>
      {label && (
        <Box margin={1}>
          <Text variant="eyebrow">{label}</Text>
        </Box>
      )}
      <AsyncSearchInput
        rootProps={{}}
        buttonProps={{ onClick: search }}
        hasFocus={hasFocus}
        inputProps={{
          onFocus: () => setHasFocus(true),
          onBlur: () => setHasFocus(false),
          placeholder,
          inputSize: 'medium',
          name: 'fiskistofa-skipaleit-sidebar',
          value: searchValue,
          onChange: (ev) => {
            setSearchValue(ev.target.value)
          },
          onKeyDown: (ev) => {
            if (ev.key === 'Enter') {
              search()
            }
          },
        }}
      />
    </Box>
  )
}

export default SidebarShipSearchInput
