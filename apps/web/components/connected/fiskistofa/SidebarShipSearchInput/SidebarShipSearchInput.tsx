import { useState } from 'react'
import { useRouter } from 'next/router'
import { AsyncSearchInput, Box, Text } from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'

interface SidebarShipSearchInputProps {
  namespace: {
    shipDetailsHref?: string
    shipSearchHref?: string
    placeholder?: string
    label?: string
  }
}

const SidebarShipSearchInput = ({ namespace }: SidebarShipSearchInputProps) => {
  const n = useNamespace(namespace)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const [hasFocus, setHasFocus] = useState(false)

  const search = () => {
    const searchValueIsNumber =
      !isNaN(Number(searchValue)) && searchValue.length > 0
    if (searchValueIsNumber) {
      const basePath = router.asPath.split('?')[0].split('#')[0]
      const pathname = n('shipDetailsHref', '/v/gagnasidur-fiskistofu')
      const query = { nr: searchValue, selectedTab: 'skip' }
      router
        .push({
          pathname,
          query,
        })
        .then(() => {
          if (pathname === basePath) {
            router.reload()
          }
        })
    } else {
      const query = {
        name: searchValue,
      }
      router.push({
        pathname: n('shipSearchHref', '/s/fiskistofa/skipaleit'),
        query,
      })
    }
  }

  const label = n('label', 'Skoða skip')
  const placeholder = n('placeholder', 'Skipaskrárnúmer eða nafn')

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
