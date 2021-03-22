import React, { ReactNode } from 'react'
import { Image, OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Hidden,
  Navigation,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { HeadWithSocialSharing, Main, Sticky } from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { SyslumennHeader, SyslumennFooter } from './Themes/SyslumennTheme'
import { DigitalIcelandHeader } from './Themes/DigitalIcelandTheme/DigitalIcelandHeader'
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
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const isWhite = (name: string) => {
  const whiteThemes = ['syslumenn', 'default']

  return whiteThemes.includes(name)
}

const OrganizationHeader: React.FC<HeaderProps> = ({ organizationPage }) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennHeader organizationPage={organizationPage} />
      break
    case 'digital_iceland':
      return <DigitalIcelandHeader organizationPage={organizationPage} />
      break
    default:
      return <DefaultHeader organizationPage={organizationPage} />
  }
}

const OrganizationFooter: React.FC<HeaderProps> = ({ organizationPage }) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennFooter organizationPage={organizationPage} />
      break
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
  children,
}) => {
  return (
    <>
      <HeadWithSocialSharing
        title={pageTitle}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <OrganizationHeader organizationPage={organizationPage} />
      <Main>
        <SidebarLayout
          paddingTop={[2, 2, 9]}
          paddingBottom={[4, 4, 4]}
          isSticky={false}
          sidebarContent={
            <Sticky>
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
              {sidebarContent}
            </Sticky>
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
          {!!pageDescription && (
            <Box paddingTop={[2, 2, 5]} paddingBottom={2}>
              <Text variant="intro">{pageDescription}</Text>
            </Box>
          )}
          <Hidden above="sm">{sidebarContent}</Hidden>
          <Box paddingTop={4}>{mainContent ?? children}</Box>
        </SidebarLayout>
        {!!mainContent && children}
      </Main>
      <OrganizationFooter organizationPage={organizationPage} />
    </>
  )
}
