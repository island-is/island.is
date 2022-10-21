import { useState } from 'react'
import { useRouter } from 'next/router'
import { AsyncSearchInput, Box, Text } from '@island.is/island-ui/core'

interface SidebarShipSearchInputProps {
  shipDetailsHref?: string
  shipSearchHref?: string
  placeholder?: string
  label?: string
}

// TODO: add suggestions to search

export const SidebarShipSearchInput = ({
  shipDetailsHref = '/v/maelabord-fiskistofu?selectedTab=skip&nr=3000',
  shipSearchHref = '/v/maelabord-fiskistofu?selectedTab=skipaleit',
  placeholder = 'Skipaskrárnúmer eða nafn',
  label = 'Skoða skip',
}: SidebarShipSearchInputProps) => {
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const [hasFocus, setHasFocus] = useState(false)

  const search = () => {
    const searchValueIsNumber =
      !isNaN(Number(searchValue)) && searchValue.length > 0
    if (searchValueIsNumber) {
      router.push({
        pathname: shipDetailsHref,
        query: { nr: Number(searchValue) },
      })
    } else {
      router.push({
        pathname: shipSearchHref,
        query: {
          name: searchValue,
        },
      })
    }
  }

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
