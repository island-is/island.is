import React, { ReactNode } from 'react'
import { Image, OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridContainer,
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
  SidebarWrapper,
} from '@island.is/web/components'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface NavigationData {
  title: string
  titleLink?: Pick<NavigationItem, 'href' | 'active'>
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
  children,
}) => {
  const isMobile = useWindowSize().width < theme.breakpoints.md

  return (
    <>
      <HeadWithSocialSharing
        title={pageTitle}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <Box className={styles.headerBg}>
        <GridContainer>
          <Box marginTop={[1, 1, 3]} marginBottom={5}>
            <Breadcrumbs
              color="white"
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href}>{link}</NextLink>
                ) : (
                  link
                )
              }}
            />
          </Box>
        </GridContainer>
        <Box className={styles.headerWrapper}>
          <SidebarWrapper sidebarContent={''} hideSidebarInMobile={true}>
            <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4, 4]}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt=""
                />
                <Text variant="h1" as="h1" color="white">
                  {organizationPage.title}
                </Text>
              </Box>
            </Box>
          </SidebarWrapper>
        </Box>
      </Box>
      <Main>
        <Box paddingTop={[0, 0, 8]}>
          <SidebarWrapper
            fullWidthContent={fullWidthContent}
            sidebarContent={
              <Box className={styles.navigation}>
                <Navigation
                  baseId="pageNav"
                  isMenuDialog={isMobile}
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={navigationData.activeItemTitle}
                  titleLink={navigationData.titleLink}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
                {sidebarContent}
              </Box>
            }
          >
            {mainContent ?? children}
          </SidebarWrapper>
        </Box>
        {mainContent ? children : ''}
      </Main>
      <OrganizationFooter organizationPage={organizationPage} />
    </>
  )
}
