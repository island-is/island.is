import { AsyncSearch, AsyncSearchOption, Text } from '@island.is/island-ui/core'
import { useMemo, useRef, useState } from 'react'
import Fuse, { IFuseOptions } from 'fuse.js'
import { LinkResolver } from '@island.is/portals/my-pages/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { PortalNavigationItem } from '@island.is/portals/core'
import { FormatMessage, useLocale } from '@island.is/localization'
import cn from 'classnames'

import * as styles from './SearchInput.css'
import { MessageDescriptor } from 'react-intl'
import { isDefined } from '@island.is/shared/utils'

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
    { name: 'title', weight: 10 },
    { name: 'description', weight: 0.5 },
    { name: 'intro', weight: 0.5 },
    { name: 'keywords', weight: 5 },
  ],
  threshold: 0.2,
  shouldSort: true,
  sortFn: (a, b) => a.score + b.score,
}

//Only load leaves into navigation results
const getNavigationItems = (
  data: PortalNavigationItem,
  formatMessage: FormatMessage,
): Array<ModuleSet> => {
  let navigationItems: Array<ModuleSet> = []

  const parseContent = (
    messageIds: Array<MessageDescriptor | undefined>,
  ): string | undefined => {
    const content = messageIds
      .map((m) => {
        if (!m) {
          return null
        }
        return formatMessage(m)
      })
      .filter(isDefined)
      .join()

    if (content.length > 150) {
      return content.substring(0, 147) + '...'
    } else if (content.length < 1) {
      return undefined
    }
    return content
  }

  if (data.children) {
    navigationItems = data.children.flatMap((child) =>
      getNavigationItems(child, formatMessage),
    )
  }

  if (
    !data.navHide &&
    data.path &&
    !data.active &&
    !data.searchHide &&
    data.enabled
  ) {
    navigationItems.push({
      title: formatMessage(data.name),
      content: parseContent([data.description, data.intro]),
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
        component: ({ active }) => {
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
