import { ReactNode, isValidElement } from 'react'
import {
  Box,
  Navigation,
  NavigationItem,
  Icon,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import {
  m,
  ServicePortalNavigationItem,
  ModuleAlertBannerSection,
  GoBack,
  FootNote,
  IntroHeader,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import SidebarLayout from './SidebarLayout'
import Sticky from '../Sticky/Sticky'
import { Link as ReactLink } from 'react-router-dom'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './Layout.css'
import { PortalNavigationItem } from '@island.is/portals/core'

interface NarrowLayoutProps {
  activeParent?: PortalNavigationItem
  pathname: string
  height: number
  children: ReactNode
}

export type SubNavItemType = NavigationItem & { enabled?: boolean }

export const NarrowLayout = ({
  children,
  pathname,
  height,
  activeParent,
}: NarrowLayoutProps) => {
  const { formatMessage } = useLocale()

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const mapChildren = (item: ServicePortalNavigationItem): SubNavItemType => {
    if (item.children) {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: item.path ? pathname.includes(item.path) : undefined,
        items: item.children
          .filter((x) => !x.navHide)
          .map((child) => {
            return mapChildren(child)
          }),
        accordion: true,
        enabled: item.enabled,
      }
    } else {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: pathname === item.path,
        enabled: item.enabled,
      }
    }
  }

  const subNavItems: SubNavItemType[] | undefined = activeParent?.children
    ?.filter((item) => !item.navHide)
    ?.map((item: ServicePortalNavigationItem) => {
      return mapChildren(item)
    })

  const findLowestActiveItem = (
    item: PortalNavigationItem,
    parent?: PortalNavigationItem,
  ): { item: PortalNavigationItem; parent?: PortalNavigationItem } => {
    const activeChild = item.children?.find((c) => c.active)

    if (!activeChild) {
      return { item, parent }
    }

    return findLowestActiveItem(activeChild, item)
  }

  let lowestActiveItem
  if (activeParent) {
    lowestActiveItem = findLowestActiveItem(activeParent)
  }

  return (
    <SidebarLayout
      isSticky={true}
      sidebarContent={
        <Sticky>
          <Box style={{ marginTop: height }}>
            <GoBack />

            {subNavItems && subNavItems.length > 0 && (
              <Box borderRadius="large" background="blue100">
                <Navigation
                  renderLink={(link, item: SubNavItemType | undefined) => {
                    return item?.href ? (
                      <ReactLink to={item?.href}>
                        {link}
                        {item.enabled === false && !item.items?.length && (
                          <Icon
                            color="blue600"
                            type="filled"
                            icon="lockClosed"
                            size="small"
                            className={styles.lock}
                          />
                        )}
                      </ReactLink>
                    ) : (
                      link
                    )
                  }}
                  asSpan
                  baseId={'service-portal-navigation'}
                  title={formatMessage(activeParent?.name ?? m.tableOfContents)}
                  items={subNavItems ?? []}
                  expand
                  expandOnActivation
                  titleIcon={activeParent?.icon}
                />
              </Box>
            )}
          </Box>
        </Sticky>
      }
    >
      <Box
        as="main"
        paddingBottom={9}
        component="main"
        style={{ marginTop: height }}
      >
        <ContentBreadcrumbs />
        {isMobile && subNavItems && subNavItems.length > 0 && (
          <Box paddingBottom={3} width="full">
            <Navigation
              renderLink={(link, item) => {
                return item?.href ? (
                  <ReactLink to={item?.href}>{link}</ReactLink>
                ) : (
                  link
                )
              }}
              asSpan
              baseId={'service-portal-mobile-navigation'}
              title={
                activeParent?.name
                  ? formatMessage(activeParent?.name)
                  : formatMessage(m.tableOfContents)
              }
              items={subNavItems}
              titleIcon={activeParent?.icon}
              isMenuDialog={true}
            />
          </Box>
        )}
        <ModuleAlertBannerSection />
        {lowestActiveItem?.item?.displayIntroHeader && (
          <IntroHeader
            title={lowestActiveItem.item.heading ?? lowestActiveItem.item.name}
            intro={
              lowestActiveItem.item.intro ?? lowestActiveItem?.parent?.intro
            }
            introComponent={
              lowestActiveItem.item.introComponent ??
              lowestActiveItem?.parent?.introComponent
            }
            serviceProviderSlug={
              lowestActiveItem.item.serviceProvider ??
              activeParent?.serviceProvider
            }
            serviceProviderTooltip={
              lowestActiveItem.item.serviceProviderTooltip
                ? formatMessage(lowestActiveItem.item.serviceProviderTooltip)
                : activeParent?.serviceProviderTooltip
                ? formatMessage(activeParent.serviceProviderTooltip)
                : undefined
            }
          />
        )}
        {children}
        <FootNote serviceProviderSlug={activeParent?.serviceProvider} />
      </Box>
    </SidebarLayout>
  )
}
