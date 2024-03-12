import React, { ReactNode, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import NextLink from 'next/link'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Button,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { SLICE_SPACING } from '@island.is/web/constants'
import { Image, OrganizationPage } from '@island.is/web/graphql/schema'
import { usePlausiblePageview } from '@island.is/web/hooks'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import { HeadWithSocialSharing } from '../HeadWithSocialSharing/HeadWithSocialSharing'
import { OrganizationFooter, OrganizationHeader } from '../Organization'

type WrapperProps = {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: Image
  organizationPage: OrganizationPage
  breadcrumbItems?: BreadCrumbItem[]
  children?: ReactNode
  sidebarContent?: ReactNode
  goBackUrl?: string
}

export const StjornartidindiWrapper = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organizationPage,
  breadcrumbItems,
  children,
  sidebarContent,
  goBackUrl,
}: WrapperProps) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | undefined>()
  usePlausiblePageview(
    organizationPage.organization?.trackingDomain ?? undefined,
  )

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.md)
  }, [width])

  if (!organizationPage) {
    return null
  }

  const metaTitleSuffix =
    pageTitle !== organizationPage.title ? ` | ${organizationPage.title}` : ''

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
                  <Link href={goBackUrl}>
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
                  </Link>
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

            <Text as="h1" variant="h1" marginTop={2} marginBottom={2}>
              {pageTitle}
            </Text>

            {pageDescription && (
              <Box className="rs_read" paddingBottom={SLICE_SPACING}>
                <Text variant="default">{pageDescription}</Text>
              </Box>
            )}

            {isMobile && (
              <Box marginBottom={SLICE_SPACING}>{sidebarContent}</Box>
            )}

            <Box className="rs_read">{children}</Box>
          </Box>
        </SidebarLayout>
      )}

      {!sidebarContent && children}

      <Box className="rs_read">
        <OrganizationFooter
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          organizations={[organizationPage.organization]}
          force={true}
        />
      </Box>
    </>
  )
}
