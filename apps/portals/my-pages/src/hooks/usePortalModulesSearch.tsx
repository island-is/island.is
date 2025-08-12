import { useMemo } from 'react'
import Fuse, { FuseSearchOptions, IFuseOptions } from 'fuse.js'
import { FormatMessage, useLocale } from '@island.is/localization'
import { MAIN_NAVIGATION } from '../lib/masterNavigation'
import { MessageDescriptor } from 'react-intl'
import { PortalNavigationItem } from '@island.is/portals/core'

const MAX_STRING_LENGTH = 97

interface ModuleSet {
  title: string
  breadcrumbs: string[]
  description?: string
  intro?: string
  keywords?: Array<string>
  uri: string

  icon?: PortalNavigationItem['icon']
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

    if (content.length > MAX_STRING_LENGTH) {
      return content.substring(0, MAX_STRING_LENGTH) + '...'
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
      icon: data.icon,
    })
  }

  return navigationItems
}

export const usePortalModulesSearch = () => {
  const { formatMessage } = useLocale()

  const fuse = useMemo(
    () =>
      new Fuse(getNavigationItems(MAIN_NAVIGATION, [], formatMessage), options),
    [formatMessage],
  )

  return (query: string, options?: FuseSearchOptions) =>
    fuse.search(query, options)
}
