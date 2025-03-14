import {
  AsyncSearch,
  AsyncSearchOption,
  BoxProps,
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
  threshold: 0.3,
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

  if (
    !data.navHide &&
    data.path &&
    !data.active &&
    data.enabled &&
    navigationItems.findIndex((n) => n.uri === data.path) < 0
  ) {
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
  white?: boolean
  colored?: boolean
}

export const SearchInput = ({ white, colored }: Props) => {
  const { formatMessage } = useLocale()
  const [query, setQuery] = useState<string>()

  const data = useMemo(() => {
    return getNavigationItems(MAIN_NAVIGATION, formatMessage)
  }, [formatMessage])

  const fuse = useMemo(() => new Fuse(data, options), [data])

  const ref = useRef<HTMLInputElement>(null)

  const searchResults: Array<AsyncSearchOption> = useMemo(() => {
    if (query) {
      const results = fuse.search(query)
      if (results?.length <= 0) {
        return []
      }
      return results.map((result) => ({
        label: result.item.title,
        value: result.item.uri,
        component: ({ active, selected }) => {
          if (active) {
            console.log(result.item.title)
          }
          return (
            <LinkResolver
              href={result.item.uri}
              className={cn(styles.item, {
                [styles.active]: active,
              })}
            >
              <Text variant="h5" as="h5" color="blue400">
                {result.item.title}
              </Text>
              {result.item.content && <Text>{result.item.content}</Text>}
            </LinkResolver>
          )
        },
      }))
    }

    return []
  }, [fuse, query])

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
  )
}
