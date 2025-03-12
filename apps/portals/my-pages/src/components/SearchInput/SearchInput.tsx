import {
  AsyncSearchInput,
  Box,
  BoxProps,
  Button,
} from '@island.is/island-ui/core'
import { useCallback, useMemo, useRef, useState } from 'react'
import Fuse, { IFuseOptions } from 'fuse.js'
import { useCombobox } from 'downshift'
import { LinkResolver } from '@island.is/portals/my-pages/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { PortalNavigationItem } from '@island.is/portals/core'
import { FormatMessage, useLocale } from '@island.is/localization'

interface ModuleSet {
  title: string
  content?: string
  keywords?: Array<string>
  uri: string
}

const options: IFuseOptions<ModuleSet> = {
  isCaseSensitive: false,
  findAllMatches: true,
  includeMatches: true,
  includeScore: true,

  //ignoreLocation: true,
  keys: [
    { name: 'title', weight: 2 },
    { name: 'content', weight: 0.5 },
    { name: 'keywords', weight: 1 },
  ],
  shouldSort: true,
}

const getNavigationItems = (
  data: PortalNavigationItem,
  formatMessage: FormatMessage,
): Array<ModuleSet> => {
  let navigationItems: Array<ModuleSet> = []

  if (data.children) {
    navigationItems = data.children.flatMap((child) =>
      getNavigationItems(child, formatMessage),
    )
  }

  if (!data.navHide && data.path && !data.active && data.enabled) {
    navigationItems.push({
      title: formatMessage(data.name),
      content: data.description ? formatMessage(data.description) : undefined,
      uri: data.path,
      keywords: data.searchTags
        ? data.searchTags.map((st) => formatMessage(st))
        : undefined,
    })
  }

  return navigationItems
}

interface Props {
  background?: BoxProps['background']
}

export const SearchInput = ({ background }: Props) => {
  const { formatMessage } = useLocale()

  const data = useMemo(() => {
    return getNavigationItems(MAIN_NAVIGATION, formatMessage)
  }, [formatMessage])

  const fuse = useMemo(() => new Fuse(data, options), [data])

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

        colored: true,
        inputSize: 'medium',
        isOpen: true,
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
      <Box
        display="flex"
        width="full"
        height="full"
        as="ul"
        flexDirection="column"
      >
        {items.slice(0, 5).map((item) => (
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
