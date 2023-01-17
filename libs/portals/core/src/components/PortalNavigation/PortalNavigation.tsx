import { Navigation, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMemo } from 'react'
import { Link } from 'react-router-dom-v5-compat'
import { useNavigation } from '../../hooks/useNavigation'
import { PortalNavigationItem } from '../../types/portalCore'

interface PortalNavigationProps {
  navigation: PortalNavigationItem
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

export function PortalNavigation({ navigation }: PortalNavigationProps) {
  const { formatMessage } = useLocale()
  const nav = useNavigation(navigation)
  const { lg } = useBreakpoint()
  const activeNav = useMemo(() => findActiveNav(nav), [nav])

  if (!nav) {
    return null
  }

  return (
    <Navigation
      title={formatMessage(nav.name)}
      baseId={'navigation'}
      isMenuDialog={!lg}
      activeItemTitle={activeNav ? formatMessage(activeNav.name) : undefined}
      renderLink={(link, item) =>
        item?.href ? <Link to={item.href}>{link}</Link> : link
      }
      items={
        nav.children?.map((child) => ({
          href: child.path,
          title: formatMessage(child.name),
          active: child.active,
          items: child.children?.map((grandChild) => ({
            href: grandChild.path,
            title: formatMessage(grandChild.name),
            active: child.active,
          })),
        })) ?? []
      }
    />
  )
}
