import { AsyncSearchInput, Box, Button, Text } from '@island.is/island-ui/core'
import { useCallback, useMemo, useRef, useState } from 'react'
import Fuse, { IFuseOptions } from 'fuse.js'
import { useCombobox } from 'downshift'
import { LinkResolver } from '@island.is/portals/my-pages/core'

interface ModuleSet {
  title: string
  content?: string
  keywords?: Array<string>
  uri: string
}

const data: Array<ModuleSet> = [
  {
    title: 'Pósthólf', //m.documents,
    content: 'Erindi til þín frá opinberum aðilum', //m.documentsDescription,
    uri: '/postholf',
  },
  {
    title: 'Umsóknir', //m.applications,
    content: 'Staða umsókna sem þú hefur sótt um í gegnum island.is', //m.applicationsDescription,
    uri: '/umsoknir',
  },
  {
    title: 'Mínar upplýsingar', //m.userInfo,
    content: 'Gögn um þig og fjölskylduna þína', //m.userInfoDescription,
    uri: '/min-gogn/yfirlit',
  },
  {
    title: 'Hugverkaréttindi', //m.intellectualProperties
    uri: '/eignir/hugverkarettindi',
  },
]

const options: IFuseOptions<ModuleSet> = {
  isCaseSensitive: false,
  findAllMatches: true,
  includeMatches: true,
  includeScore: true,
  //ignoreLocation: true,
  keys: [
    { name: 'title', weight: 2 },
    { name: 'content', weight: 0.5 },
  ],
  shouldSort: true,
}

export const SearchInput = () => {
  const fuse = useMemo(() => new Fuse(data, options), [])

  const [items, setItems] = useState<ModuleSet[]>([])

  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    closeMenu,
    isOpen,
    highlightedIndex,
    inputValue,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      search(inputValue ?? '')
    },
    items,
    itemToString(item) {
      return item ? item.title : ''
    },
  })

  const [hasFocus, setHasFocus] = useState<boolean>(false)

  const ref = useRef<HTMLInputElement>(null)

  const onBlur = useCallback(() => setHasFocus(false), [setHasFocus])
  const onFocus = useCallback(() => {
    setHasFocus(true)
  }, [setHasFocus])

  const search = (query: string) => {
    const result = fuse.search(query)
    setItems(result.map((r) => r.item))
  }

  const onSubmit = () => {
    if (ref.current?.value) {
      search(ref.current.value)
    }
  }

  const shouldShowItems = items.length > 0 && isOpen

  return (
    <AsyncSearchInput
      ref={ref}
      hasFocus={hasFocus}
      inputProps={{
        ...getInputProps({
          value: inputValue,
          onFocus,
          onBlur,
          ref,
          spellCheck: true,
        }),
        inputSize: 'medium',
        isOpen: shouldShowItems,
        placeholder: 'Leita',
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            onSubmit()
          }
        },
      }}
      buttonProps={{
        onFocus,
        onBlur,
        onClick: () => {
          closeMenu()
          onSubmit()
        },
      }}
      labelProps={getLabelProps()}
      menuProps={{
        ...getMenuProps(),
        isOpen,
        shouldShowItems,
      }}
    >
      <Box display="flex" as="ul" flexDirection="row">
        {items.map((item) => (
          <LinkResolver href={item.uri}>
            <Button as="span" size="small" variant="text" unfocusable>
              {item.title}
            </Button>
          </LinkResolver>
        ))}
      </Box>
    </AsyncSearchInput>
  )
}
