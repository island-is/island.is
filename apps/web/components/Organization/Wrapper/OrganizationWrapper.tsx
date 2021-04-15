import React, { ReactNode } from 'react'
import { Image, OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Link,
  Navigation,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './OrganizationWrapper.treat'
import NextLink from 'next/link'
import {
  HeadWithSocialSharing,
  Main,
  OrganizationFooter,
  Sticky,
} from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface NavigationData {
  title: string
  activeItemTitle?: string
  items: NavigationItem[]
}

interface WrapperProps {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: Image
  organizationPage?: OrganizationPage
  breadcrumbItems?: BreadCrumbItem[]
  mainContent?: ReactNode
  sidebarContent?: ReactNode
  navigationData: NavigationData
  fullWidthContent?: boolean
  stickySidebar?: boolean
  minimal?: boolean
}

export const OrganizationWrapper: React.FC<WrapperProps> = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organizationPage,
  breadcrumbItems,
  mainContent,
  sidebarContent,
  navigationData,
  fullWidthContent = false,
  stickySidebar = true,
  children,
  minimal = false,
}) => {
  const isMobile = useWindowSize().width < theme.breakpoints.md
  const { linkResolver } = useLinkResolver()

  const metaTitleSuffix =
    pageTitle !== organizationPage.title ? ` | ${organizationPage.title}` : ''

  const SidebarContainer = stickySidebar ? Sticky : Box

  return (
    <>
      <HeadWithSocialSharing
        title={`${pageTitle}${metaTitleSuffix}`}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <Box className={styles.headerBg}>
        <Box className={styles.headerWrapper}>
          <SidebarLayout
            sidebarContent={
              !!organizationPage.organization.logo &&
              !minimal && (
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
                  }
                >
                  <Box
                    borderRadius="circle"
                    className={styles.iconCircle}
                    background="white"
                  >
                    <img
                      src={organizationPage.organization.logo.url}
                      className={styles.headerLogo}
                      alt=""
                    />
                  </Box>
                </Link>
              )
            }
          >
            <Hidden above="sm">
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Box
                  borderRadius="circle"
                  className={styles.iconCircle}
                  background="white"
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt=""
                  />
                </Box>
              </Link>
            </Hidden>
            <Box
              marginTop={[2, 2, 6]}
              textAlign={['center', 'center', 'right']}
            >
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Text variant="h1" color="white">
                  {organizationPage.title}
                </Text>
              </Link>
            </Box>
          </SidebarLayout>
        </Box>
      </Box>
      <Main>
        {!minimal && (
          <SidebarLayout
            paddingTop={[2, 2, 9]}
            paddingBottom={[4, 4, 4]}
            isSticky={false}
            sidebarContent={
              <SidebarContainer>
                <Navigation
                  baseId="pageNav"
                  isMenuDialog={isMobile}
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={navigationData.activeItemTitle}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
                {sidebarContent}
              </SidebarContainer>
            }
          >
            <Hidden above="sm">
              <Box marginY={2}>
                <Navigation
                  baseId="pageNav"
                  isMenuDialog={isMobile}
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={navigationData.activeItemTitle}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
              </Box>
            </Hidden>
            <Breadcrumbs
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href}>{link}</NextLink>
                ) : (
                  link
                )
              }}
            />
            {pageDescription && (
              <Box paddingTop={[2, 2, 5]} paddingBottom={2}>
                <Text variant="intro">{pageDescription}</Text>
              </Box>
            )}
            <Hidden above="sm">{sidebarContent}</Hidden>
            <Box paddingTop={4}>{mainContent ?? children}</Box>
          </SidebarLayout>
        )}
        {!!mainContent && children}
        {minimal && (
          <GridContainer>
            <GridRow>
              <GridColumn
                paddingTop={6}
                span={['12/12', '12/12', '10/12']}
                offset={['0', '0', '1/12']}
              >
                {children}
              </GridColumn>
            </GridRow>
          </GridContainer>
        )}
      </Main>
      {!minimal && <OrganizationFooter organizationPage={organizationPage} />}
    </>
  )
}
