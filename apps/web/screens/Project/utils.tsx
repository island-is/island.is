import Link from 'next/link'

import { Navigation, NavigationItem, Stack } from '@island.is/island-ui/core'
import {
  Link as LinkSchema,
  LinkGroup,
  ProjectPage,
} from '@island.is/web/graphql/schema'
import { LayoutProps } from '@island.is/web/layouts/main'

const lightThemes = [
  'traveling-to-iceland',
  'election',
  'ukraine',
  'default',
  'opinbernyskopun',
  'grindavik',
  'default-v2',
]

export const getThemeConfig = (
  projectPage?: ProjectPage,
): {
  themeConfig: Partial<LayoutProps>
} => {
  const theme = projectPage?.theme

  const footerVersion =
    (projectPage?.footerItems ?? []).length > 0 ? 'organization' : 'default'

  let showHeader = true
  if (theme === 'gagnasidur-fiskistofu' || theme === 'directorate-of-health') {
    showHeader = false
  }

  const isLightTheme = lightThemes.includes(theme ?? '')
  if (!isLightTheme) {
    return {
      themeConfig: {
        headerButtonColorScheme: 'negative',
        headerColorScheme: 'white',
        footerVersion,
        showHeader,
      },
    }
  }
  return { themeConfig: { footerVersion, showHeader } }
}

export const convertLinksToNavigationItem = (links: LinkSchema[]) =>
  links.map(({ text, url }) => {
    return {
      title: text,
      href: url,
      active: false,
    }
  })

export const convertLinkGroupsToNavigationItems = (
  linkGroups: LinkGroup[],
): NavigationItem[] =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  linkGroups.map(({ primaryLink, childrenLinks }) => {
    return {
      title: primaryLink?.text,
      href: primaryLink?.url,
      active: false,
      items: convertLinksToNavigationItem(childrenLinks),
    }
  })

export const assignNavigationActive = (
  items: NavigationItem[],
  clientUrl: string,
): NavigationItem[] =>
  items.map((item) => {
    let isAnyChildActive = false
    const childItems = item.items?.map((childItem) => {
      const isChildActive = clientUrl === childItem.href
      if (isChildActive) isAnyChildActive = isChildActive
      return {
        ...childItem,
        active: isChildActive,
      }
    })
    return {
      title: item.title,
      href: item.href,
      active: clientUrl === item.href || isAnyChildActive,
      items: childItems,
    }
  })

export const getSidebarNavigationComponent = (
  projectPage: ProjectPage,
  baseRouterPath: string,
  navigationTitle: string,
  mobileNavigationButtonOpenLabel: string,
  mobileNavigationButtonCloseLabel: string,
) => {
  const navigationList = assignNavigationActive(
    convertLinkGroupsToNavigationItems(projectPage.sidebarLinks),
    baseRouterPath,
  )
  const secondaryNavigationList =
    projectPage.secondarySidebar?.childrenLinks.map(({ text, url }) => ({
      title: text,
      href: url,
      active: baseRouterPath === url,
    })) ?? []

  return (isMenuDialog = false) => (
    <Stack space={2}>
      <Navigation
        isMenuDialog={isMenuDialog}
        baseId="pageNav"
        items={navigationList}
        title={navigationTitle}
        mobileNavigationButtonOpenLabel={mobileNavigationButtonOpenLabel}
        mobileNavigationButtonCloseLabel={mobileNavigationButtonCloseLabel}
        renderLink={(link, item) => {
          return item?.href ? (
            <Link href={item.href} legacyBehavior>
              {link}
            </Link>
          ) : (
            link
          )
        }}
      />
      {projectPage.secondarySidebar?.name && (
        <Navigation
          baseId="secondaryPageNav"
          colorScheme="purple"
          isMenuDialog={isMenuDialog}
          title={projectPage.secondarySidebar.name}
          items={secondaryNavigationList}
          renderLink={(link, item) => {
            return item?.href ? (
              <Link href={item.href} legacyBehavior>
                {link}
              </Link>
            ) : (
              link
            )
          }}
        />
      )}
    </Stack>
  )
}
