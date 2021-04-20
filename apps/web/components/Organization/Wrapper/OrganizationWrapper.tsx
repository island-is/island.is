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
  Navigation,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { HeadWithSocialSharing, Sticky } from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { SyslumennHeader, SyslumennFooter } from './Themes/SyslumennTheme'
import { DigitalIcelandHeader } from './Themes/DigitalIcelandTheme'
import { DefaultHeader } from './Themes/DefaultTheme'

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

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const lightThemes = ['digital_iceland']

const OrganizationHeader: React.FC<HeaderProps> = ({ organizationPage }) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennHeader organizationPage={organizationPage} />
    case 'digital_iceland':
      return <DigitalIcelandHeader organizationPage={organizationPage} />
    default:
      return <DefaultHeader organizationPage={organizationPage} />
  }
}

const OrganizationFooter: React.FC<HeaderProps> = ({ organizationPage }) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennFooter organizationPage={organizationPage} />
    default:
      return null
  }
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
  const secondaryNavList: NavigationItem[] = organizationPage.secondaryMenu?.childrenLinks.map(
    ({ text, url }) => ({
      title: text,
      href: url,
      active: text === pageTitle,
    }),
  )

  const metaTitleSuffix =
    pageTitle !== organizationPage.title ? ` | ${organizationPage.title}` : ''

  const SidebarContainer = stickySidebar ? Sticky : Box

  return (
    <>
      <HeadWithSocialSharing
        title={`${pageTitle}${metaTitleSuffix}`}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageContentType={pageFeaturedImage?.contentType}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <OrganizationHeader organizationPage={organizationPage} />
      <>
        {!minimal && (
          <SidebarLayout
            paddingTop={[2, 2, 9]}
            paddingBottom={[4, 4, 4]}
            isSticky={false}
            addAsideLandmark={!stickySidebar}
            fullWidthContent={fullWidthContent}
            sidebarContent={
              <SidebarContainer>
                <Navigation
                  baseId="pageNav"
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
                {organizationPage.secondaryMenu && (
                  <Box marginTop={3}>
                    <Navigation
                      colorScheme="purple"
                      baseId="secondarynav"
                      activeItemTitle={pageTitle}
                      title={organizationPage.secondaryMenu.name}
                      items={secondaryNavList}
                      renderLink={(link, item) => {
                        return item?.href ? (
                          <NextLink href={item?.href}>{link}</NextLink>
                        ) : (
                          link
                        )
                      }}
                    />
                  </Box>
                )}
                {sidebarContent}
              </SidebarContainer>
            }
          >
            <Hidden above="sm">
              <Box marginY={2}>
                <Navigation
                  baseId="pageNav"
                  isMenuDialog={true}
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
              {organizationPage.secondaryMenu && (
                <Box marginY={2}>
                  <Navigation
                    colorScheme="purple"
                    baseId="secondarynav"
                    isMenuDialog={true}
                    title={organizationPage.secondaryMenu.name}
                    items={secondaryNavList}
                    renderLink={(link, item) => {
                      return item?.href ? (
                        <NextLink href={item?.href}>{link}</NextLink>
                      ) : (
                        link
                      )
                    }}
                  />
                </Box>
              )}
            </Hidden>
            <GridContainer>
              <GridRow>
                <GridColumn
                  span={fullWidthContent ? ['9/9', '9/9', '7/9'] : '9/9'}
                  offset={fullWidthContent ? ['0', '0', '1/9'] : '0'}
                >
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
                    <Box paddingTop={[2, 2, 5]}>
                      <Text variant="intro">{pageDescription}</Text>
                    </Box>
                  )}
                </GridColumn>
              </GridRow>
            </GridContainer>
            <Hidden above="sm">{sidebarContent}</Hidden>
            <Box paddingTop={fullWidthContent ? 0 : 4}>
              {mainContent ?? children}
            </Box>
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
      </>
      {!minimal && <OrganizationFooter organizationPage={organizationPage} />}
    </>
  )
}
