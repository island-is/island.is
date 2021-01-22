import React, { ReactNode } from 'react'
import { Image, Organization } from '@island.is/web/graphql/schema'
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
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import NextLink from 'next/link'
import { HeadWithSocialSharing, Main } from '@island.is/web/components'
import SidebarWrapper from '@island.is/web/components/Organization/Wrapper/SidebarWrapper'
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
  organization?: Organization
  breadcrumbItems?: BreadCrumbItem[]
  mainContent?: ReactNode
  navigationData: NavigationData
}

const OrganizationWrapper: React.FC<WrapperProps> = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organization,
  breadcrumbItems,
  mainContent,
  navigationData,
  children,
}) => {
  const { linkResolver } = useLinkResolver()
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
        <Box className={styles.headerBg}>
          <GridContainer>
            <Box marginTop={[1, 1, 3]} marginBottom={5}>
              <Breadcrumbs
                color="white"
                items={breadcrumbItems ?? []}
                renderLink={(link) => {
                  return (
                    <NextLink {...linkResolver('homepage')} passHref>
                      {link}
                    </NextLink>
                  )
                }}
              />
            </Box>
          </GridContainer>
          <Box className={styles.headerWrapper}>
            <SidebarWrapper sidebarContent="" hideSidebarInMobile={true}>
              <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4, 4]}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <img
                    src={organization.logo.url}
                    className={styles.headerLogo}
                    alt=""
                  />
                  <Text variant="h1" as="h1" color="white">
                    {organization.title}
                  </Text>
                </Box>
              </Box>
            </SidebarWrapper>
          </Box>
        </Box>
      </Box>
      <Main>
        <Box paddingTop={[0, 0, 8]}>
          <SidebarWrapper
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
                    return (
                      <NextLink href={item?.href ?? '/hello'}>{link}</NextLink>
                    )
                  }}
                />
              </Box>
            }
          >
            {mainContent}
          </SidebarWrapper>
        </Box>
        {children}
      </Main>
    </>
  )
}

export default OrganizationWrapper
