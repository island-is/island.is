import { ReactNode, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import NextLink from 'next/link'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Footer as WebFooter } from '@island.is/web/components'
import { Organization } from '@island.is/web/graphql/schema'
import { usePlausiblePageview } from '@island.is/web/hooks'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import { HeadWithSocialSharing } from '../HeadWithSocialSharing/HeadWithSocialSharing'

type WrapperProps = {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: string
  organization?: Organization
  breadcrumbItems?: BreadCrumbItem[]
  children?: ReactNode
  preFooter?: ReactNode
  sidebarContent?: ReactNode
  goBackUrl?: string
  hideTitle?: boolean
  isHomePage?: boolean
}

export const OJOIWrapper = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organization,
  breadcrumbItems,
  children,
  preFooter,
  sidebarContent,
  goBackUrl,
  hideTitle,
  isHomePage,
}: WrapperProps) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | undefined>()
  usePlausiblePageview(organization?.trackingDomain ?? undefined)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.md)
  }, [width])

  if (!organization) {
    return null
  }

  const metaTitleSuffix =
    pageTitle !== organization.title ? ` | ${organization.title}` : ''

  return (
    <>
      <HeadWithSocialSharing
        title={`${pageTitle}${metaTitleSuffix}`}
        description={pageDescription}
        imageUrl={pageFeaturedImage}
      />

      {sidebarContent && (
        <SidebarLayout
          paddingTop={[2, 2, 9]}
          paddingBottom={[6, 6, 9]}
          isSticky={false}
          fullWidthContent={true}
          sidebarContent={
            <>
              {goBackUrl ? (
                <Box marginBottom={2}>
                  <LinkV2 href={goBackUrl}>
                    <Button
                      preTextIcon="arrowBack"
                      preTextIconType="filled"
                      size="small"
                      type="button"
                      variant="text"
                      as="span"
                      unfocusable
                    >
                      Til baka
                    </Button>
                  </LinkV2>
                </Box>
              ) : null}

              {sidebarContent}
            </>
          }
        >
          <Box marginLeft={[0, 0, 0, 0, 3]}>
            {breadcrumbItems && (
              <Breadcrumbs
                items={breadcrumbItems ?? []}
                renderLink={(link, item) => {
                  return item?.href ? (
                    <NextLink href={item?.href} legacyBehavior>
                      {link}
                    </NextLink>
                  ) : (
                    link
                  )
                }}
              />
            )}

            {!hideTitle && (
              <Text as="h1" variant="h1" marginTop={2} marginBottom={3}>
                {pageTitle}
              </Text>
            )}

            {pageDescription && (
              <Box className="rs_read" marginTop={3} paddingBottom={4}>
                <Text variant="default">{pageDescription}</Text>
              </Box>
            )}

            {isMobile && (
              <Box marginBottom={4} marginTop={3}>
                {sidebarContent}
              </Box>
            )}

            <Box className="rs_read">{children}</Box>
          </Box>
        </SidebarLayout>
      )}

      {!sidebarContent && !isHomePage && (
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              {breadcrumbItems && (
                <Breadcrumbs
                  items={breadcrumbItems ?? []}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href} legacyBehavior>
                        {link}
                      </NextLink>
                    ) : (
                      link
                    )
                  }}
                />
              )}

              {!hideTitle && (
                <Text as="h1" variant="h1" marginTop={2} marginBottom={3}>
                  {pageTitle}
                </Text>
              )}

              {pageDescription && (
                <Box className="rs_read" marginTop={3} paddingBottom={4}>
                  <Text variant="default">{pageDescription}</Text>
                </Box>
              )}

              <Box className="rs_read" marginBottom={'containerGutter'}>
                {children}
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}

      {!sidebarContent && isHomePage && children}

      {preFooter}

      <Box className="rs_read" background="blue100">
        <WebFooter
          imageUrl={organization.logo?.url}
          heading={organization.title}
          columns={organization.footerItems}
          titleVariant="h2"
        />
      </Box>
    </>
  )
}
