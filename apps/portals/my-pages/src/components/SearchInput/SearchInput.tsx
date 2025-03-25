import {
  AsyncSearch,
  AsyncSearchInput,
  AsyncSearchOption,
  Breadcrumbs,
  Text,
} from '@island.is/island-ui/core'
import { useMemo, useRef, useState } from 'react'
import Fuse, { IFuseOptions } from 'fuse.js'
import { LinkResolver } from '@island.is/portals/my-pages/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { PortalNavigationItem } from '@island.is/portals/core'
import { FormatMessage, useLocale } from '@island.is/localization'
import cn from 'classnames'

import * as styles from './SearchInput.css'
import { MessageDescriptor } from 'react-intl'
import { useCombobox } from 'downshift'

interface ModuleSet {
  title: string
  breadcrumbs: string[]
  description?: string
  intro?: string
  keywords?: Array<string>
  uri: string
}

const options: IFuseOptions<ModuleSet> = {
  isCaseSensitive: false,
  findAllMatches: true,
  includeMatches: true,
  includeScore: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 0.5 },
    { name: 'intro', weight: 0.5 },
    { name: 'keywords', weight: 5 },
  ],
  threshold: 0.2,
  shouldSort: true,
  sortFn: (a, b) => a.score - b.score,
}

//Only load leaves into navigation results
const getNavigationItems = (
  data: PortalNavigationItem,
  breadcrumbs: string[],
  formatMessage: FormatMessage,
): Array<ModuleSet> => {
  let navigationItems: Array<ModuleSet> = []

  const parseContent = (
    messageId: MessageDescriptor | undefined,
  ): string | undefined => {
    if (!messageId) return undefined
    const content = formatMessage(messageId)

    if (content.length > 97) {
      return content.substring(0, 97) + '...'
    } else if (content.length < 1) {
      return undefined
    }
    return content
  }

  if (data.children) {
    navigationItems = data.children.flatMap((child) =>
      getNavigationItems(
        child,
        [...breadcrumbs, formatMessage(data.name)],
        formatMessage,
      ),
    )
  }

  const moduleName = formatMessage(data.name)

  if (
    !data.navHide &&
    data.path &&
    !data.active &&
    !data.searchHide &&
    data.enabled &&
    navigationItems.findIndex((n) => n.title === moduleName) < 0
  ) {
    navigationItems.push({
      title: moduleName,
      breadcrumbs: [...breadcrumbs, formatMessage(data.name)],
      description: parseContent(data.description),
      intro: parseContent(data.intro),
      uri: data.path,
      keywords: data.searchTags
        ? data.searchTags.map((st) => formatMessage(st))
        : undefined,
    })
  }

  return navigationItems
}

interface Props {
  white?: boolean
  colored?: boolean
}

export const SearchInput = ({ white, colored }: Props) => {
  const { formatMessage } = useLocale()
  const [query, setQuery] = useState<string>()

  const [hasFocus, setHasFocus] = useState<boolean>(false)

  const data = useMemo(() => {
    return getNavigationItems(MAIN_NAVIGATION, [], formatMessage)
  }, [formatMessage])

  const fuse = useMemo(() => new Fuse(data, options), [data])

  const ref = useRef<HTMLInputElement>(null)

  const searchResults: Array<AsyncSearchOption> = useMemo(() => {
    if (query && query.length > 1) {
      const results = fuse.search(query, {
        limit: 5,
      })

      if (results?.length <= 0) {
        return []
      }

      return results.map((result) => ({
        label: result.item.title,
        value: result.item.uri,
        component: ({ active }) => {
          return (
            <LinkResolver
              href={result.item.uri}
              className={cn(styles.item, {
                [styles.active]: active,
              })}
            >
              <Breadcrumbs
                items={result.item.breadcrumbs.slice(1).map((b) => ({
                  title: b,
                }))}
              />
              <Text marginTop={1}>{result.item.description}</Text>
            </LinkResolver>
          )
        },
      }))
    }

    return []
  }, [fuse, query])

  const { getMenuProps, getItemProps, getInputProps } = useCombobox({
    items: searchResults,
    itemToString: (item: AsyncSearchOption | null) => (item ? item.label : ''),
  })

  return <AsyncSearchInput hasFocus={hasFocus}></AsyncSearchInput>

  /*
  return (
    <AsyncSearch
      ref={ref}
      id="my-pages-async-search"
      placeholder="Leita"
      colored={colored}
      white={white}
      options={searchResults ?? []}
      inputValue={query}
      closeMenuOnSubmit
      onInputValueChange={(value) => {
        if (!value && query) {
          setQuery(undefined)
        }
        if (value && value !== query) {
          setQuery(value)
        }
      }}
    />
    ) */
}
