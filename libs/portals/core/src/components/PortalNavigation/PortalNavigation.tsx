import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'

import { Navigation, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'

import { useNavigation } from '../../hooks/useNavigation'
import { PortalNavigationItem } from '../../types/portalCore'

type NavChildrenBase = {
  active: boolean
  href: string | undefined
  title: string
}

type NavChildren = NavChildrenBase & {
  items?: NavChildren[]
}

interface PortalNavigationProps {
  navigation: PortalNavigationItem
  title?: string
}

const findActiveNav = (
  navigation?: PortalNavigationItem,
): PortalNavigationItem | undefined => {
  if (!navigation) {
    return undefined
  }
  const activeChild = navigation.children?.find((item) => item.active)
  return findActiveNav(activeChild) || activeChild
}

export function PortalNavigation({
  navigation,
  title = '',
}: PortalNavigationProps) {
  const { formatMessage } = useLocale()
  const nav = useNavigation(navigation)
  const { lg } = useBreakpoint()
  const activeNav = useMemo(() => findActiveNav(nav), [nav])
  const params = useParams()

  if (!nav) {
    return null
  }

  /**
   * This function recursively renders navigation items unless they are hidden
   * with the navHide flag.
   */
  const renderNavChildren = (
    item: PortalNavigationItem,
  ): NavChildren | undefined => {
    return !item.navHide
      ? {
          ...item,
          href: item.path,
          title: formatMessage(item.name),
          active:
            item.active || item.children?.some(({ active }) => active) || false,
          items: item.children?.map(renderNavChildren).filter(isDefined),
        }
      : undefined
  }

  return (
    <Navigation
      title={title ?? formatMessage(nav.name)}
      baseId={'navigation'}
      isMenuDialog={!lg}
      activeItemTitle={activeNav ? formatMessage(activeNav.name) : undefined}
      renderLink={(link, item) => {
        let href = item?.href ?? ''
        href = replaceParams({
          href,
          params,
        })

        return href ? <Link to={href}>{link}</Link> : link
      }}
      items={nav.children?.map(renderNavChildren).filter(isDefined) ?? []}
    />
  )
}
